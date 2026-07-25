import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.goto('https://www.du.ac.in/', { waitUntil: 'networkidle2', timeout: 30000 });

  const items = await page.evaluate(() => {
    // We can try both user XPaths
    const xpath = '//*[@id="pills-spotlight"]//li';
    const result = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    const notices: any[] = [];
    
    for (let i = 0; i < result.snapshotLength; i++) {
      const li = result.snapshotItem(i) as HTMLElement;
      if (!li) continue;
      
      // Get all links inside this li
      const links = Array.from(li.querySelectorAll('a'));
      // The main title link usually has title attribute or long text
      const mainLink = links.find(l => l.title && l.title.length > 5) || links.find(l => l.innerText.trim().length > 10);
      
      if (mainLink) {
        // Get date if possible
        const day = li.querySelector('.day')?.textContent?.trim() || '';
        const month = li.querySelector('.month')?.textContent?.trim() || '';
        const dateStr = day && month ? `${day} ${month} 2026` : '';
        
        notices.push({
          title: mainLink.title || mainLink.innerText.trim(),
          href: mainLink.href,
          date: dateStr,
          rawText: li.innerText.trim().replace(/\s+/g, ' ')
        });
      }
    }
    return notices;
  });
  
  console.log('Total extracted:', items.length);
  console.log('20 Jul notices:', items.filter(i => i.rawText.includes('20 Jul')));
  console.log('First 3:', JSON.stringify(items.slice(0, 3), null, 2));
  await browser.close();
})();
