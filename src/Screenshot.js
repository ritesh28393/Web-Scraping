'use strict';

const puppeteer = require('puppeteer');

(async() => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://amazon.in');
  await page.screenshot({path: 'screenshots/amazon.png'});
  await browser.close();
})();