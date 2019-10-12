'use strict';

const puppeteer = require('puppeteer');

const browser = require('./puppeteerFunctions/browser.js');
const page = require('./puppeteerFunctions/page.js');

(async () => {
  const browserInstance = await browser.launch(puppeteer, true);
  const pageInstance = await browser.newPage(browserInstance);
  await page.goto(pageInstance, 'https://www.amazon.in');
  await page.screenshot(pageInstance, './screenshots/amazonHome.png', true);
  await browser.close(browserInstance);
})();