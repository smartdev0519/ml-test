import { PuppeteerWebBaseLoader } from 'langchain/document_loaders/web/puppeteer';
export const loader = new PuppeteerWebBaseLoader('https://python.langchain.com/en/latest/index.html', {
  launchOptions: {
    headless: true,
  },
  gotoOptions: {
    waitUntil: 'domcontentloaded',
  },
  /** Pass custom evaluate, in this case you get page and browser instances */
 
});


