'use strict';

const puppeteer = require('puppeteer');

const browser = require('./puppeteerFunctions/browser.js');
const page = require('./puppeteerFunctions/page.js');
const keyboard = require('./puppeteerFunctions/keyboard.js');
const mouse = require('./puppeteerFunctions/mouse.js');

(async () => {
  const browserInstance = await browser.launch(puppeteer, false);
  const pageInstance = await browser.newPage(browserInstance);
  await page.goto(pageInstance, 'https://www.amazon.in');
  await page.screenshot(pageInstance, './screenshots/amazonHome.png', true);
  await browser.close(browserInstance);
})();