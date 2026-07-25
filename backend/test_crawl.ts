import { runCrawler } from './src/crawler/cron';

async function main() {
  console.log('Starting manual crawl...');
  await runCrawler();
  console.log('Crawl finished.');
  process.exit(0);
}

main();
