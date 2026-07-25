import cron from 'node-cron';
import { parseUniversityNotices } from '../parser';
import { saveNotices } from '../notifier/db';

const SITES = [
  { university: 'DU', url: 'https://www.du.ac.in/' },
  { university: 'BHU', url: 'https://admission.bhu.ac.in/en' },
  { university: 'JNU', url: 'https://jnuee.jnu.ac.in/' }
];

export async function runCrawler() {
  console.log(`[${new Date().toISOString()}] Starting crawler job...`);
  
  for (const site of SITES) {
    console.log(`Scraping ${site.university}...`);
    const notices = await parseUniversityNotices(site.university, site.url);
    const newCount = await saveNotices(notices);
    console.log(`Saved ${newCount} new notices for ${site.university}`);
  }
  
  console.log(`[${new Date().toISOString()}] Crawler job finished.`);
}

export function startCronJob() {
  // Run daily at 5 AM IST
  cron.schedule('0 5 * * *', () => {
    runCrawler();
  }, {
    timezone: 'Asia/Kolkata'
  });
  console.log('Cron job scheduled for 5 AM IST.');
}
