import puppeteer, { Browser } from 'puppeteer';

export async function parseUniversityNotices(university: string, url: string) {
  const notices: { university: string; title: string; url: string; isPdf: boolean; date?: Date; summary?: string }[] = [];
  let browser: Browser | null = null;

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    // Wait a brief 2 seconds for any client-side rendering of tables/lists
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Parser logic
    const extracted = await page.evaluate((uni: string) => {
      const items: { title: string; href: string; dateStr?: string; summary?: string }[] = [];
      
      if (uni === 'DU') {
        const xpath = '//*[@id="pills-spotlight"]//li';
        const result = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        for (let i = 0; i < result.snapshotLength; i++) {
          const li = result.snapshotItem(i) as HTMLElement;
          if (!li) continue;
          
          const links = Array.from(li.querySelectorAll('a'));
          const mainLink = links.find(l => l.title && l.title.length > 5) || links.find(l => l.innerText.trim().length > 10);
          
          if (mainLink) {
            const day = li.querySelector('.day')?.textContent?.trim() || '';
            const month = li.querySelector('.month')?.textContent?.trim() || '';
            const dateStr = day && month ? `${day} ${month} 2026` : '';
            
            items.push({
              title: mainLink.title || mainLink.innerText.trim(),
              href: mainLink.href,
              dateStr,
              summary: li.innerText.trim().replace(/\s+/g, ' ')
            });
          }
        }
      } else if (uni === 'BHU') {
        const xpath = '//*[@id="main-content"]/div/main/div[1]/main/section[3]/div/section/div/table/tbody/tr';
        const result = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        for (let i = 0; i < result.snapshotLength; i++) {
          const tr = result.snapshotItem(i) as HTMLElement;
          if (!tr) continue;
          
          const a = tr.querySelector('a');
          const tds = Array.from(tr.querySelectorAll('td'));
          if (a) {
            const rawTitle = a.innerText.trim() || a.title || '';
            const title = rawTitle.replace(/\n?NEW$/i, '').trim();
            const dateText = tds[2]?.innerText?.trim() || '';
            let dateStr = '';
            if (dateText && dateText.includes('/')) {
              const parts = dateText.split('/');
              if (parts.length === 3) {
                dateStr = `${parts[2]}-${parts[1]}-${parts[0]}`;
              }
            }
            items.push({
              title,
              href: a.href,
              dateStr,
              summary: tr.innerText.trim().replace(/\s+/g, ' ')
            });
          }
        }
      } else if (uni === 'JNU') {
        const xpaths = [
          '/html/body/main/div/div[1]/div[6]/div[1]/div/ul//a',
          '/html/body/main/div/div[3]/div[2]//a'
        ];
        for (const xpath of xpaths) {
          const result = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
          for (let i = 0; i < result.snapshotLength; i++) {
            const a = result.snapshotItem(i) as HTMLAnchorElement;
            if (!a || !a.href) continue;

            const rawText = a.innerText.trim() || a.textContent?.trim() || '';
            const titleWithoutLastDate = rawText.replace(/\n?last\s*date:.*$/i, '').trim();
            const title = titleWithoutLastDate.replace(/\s*NEW$/i, '').replace(/<span.*?span>/gi, '').trim();
            
            let dateStr = '';
            const dateMatch = rawText.match(/(?:last\s*date:\s*)?([0-9]{1,2}(?:st|nd|rd|th)?\s+[A-Za-z]+,?\s+[0-9]{4})/i) ||
                              (a.parentElement?.innerText || '').match(/(?:last\s*date:\s*)?([0-9]{1,2}(?:st|nd|rd|th)?\s+[A-Za-z]+,?\s+[0-9]{4})/i);
            if (dateMatch && dateMatch[1]) {
              dateStr = dateMatch[1].replace(/(st|nd|rd|th)/i, '');
            }

            items.push({
              title: title || rawText,
              href: a.href,
              dateStr,
              summary: rawText.replace(/\s+/g, ' ')
            });
          }
        }
      } else {
        const links = Array.from(document.querySelectorAll('a'));
        for (const a of links) {
          items.push({
            title: a.innerText.trim(),
            href: a.href,
          });
        }
      }

      return items;
    }, university);

    for (const item of extracted) {
      if (item.title.length <= 5 || !item.href.startsWith('http')) continue;

      let isValid = false;
      if (university === 'DU' || university === 'BHU' || university === 'JNU') {
        isValid = true; // For DU, BHU, and JNU, all links extracted from specific XPaths are valid
      } else if (
          item.title.toLowerCase().includes('notice') || 
          item.title.toLowerCase().includes('admission') ||
          item.title.toLowerCase().includes('result') ||
          item.title.toLowerCase().includes('circular') ||
          item.title.toLowerCase().includes('exam')
      ) {
        isValid = true;
      }
      
      if (isValid) {
        let parsedDate: Date | undefined;
        if (item.dateStr) {
           parsedDate = new Date(item.dateStr);
           if (isNaN(parsedDate.getTime())) parsedDate = undefined;
        }

        notices.push({
          university,
          title: item.title,
          url: item.href,
          isPdf: item.href.toLowerCase().includes('.pdf'),
          date: parsedDate,
          summary: item.summary
        });
      }
    }
  } catch (error) {
    console.error(`Failed to parse ${university} at ${url}:`, error);
  } finally {
    if (browser) await browser.close();
  }
  
  // return up to 20 notices to avoid spam
  return notices.slice(0, 20);
}
