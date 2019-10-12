'use strict';

const puppeteer = require('puppeteer');

const browser = require('./puppeteerFunctions/browser.js');
const page = require('./puppeteerFunctions/page.js');
const keyboard = require('./puppeteerFunctions/keyboard.js');
const mouse = require('./puppeteerFunctions/mouse.js');

const CREDS = require('../AmazonCreds.js');

(async () => {
    const browserInstance = await browser.launch(puppeteer, false);
    const pageInstance = await browser.newPage(browserInstance);
    await page.goto(pageInstance, 'https://www.amazon.in');

    const SIGNIN_ANCHOR_1 = '#nav-link-accountList';
    const SIGNIN_ANCHOR_2 = '#nav-flyout-ya-signin > a';
    const EMAIL_INPUT = '#ap_email';
    const EMAIL_CONTINUE_BUTTON = '#continue';
    const PASSWORD_INPUT = '#ap_password';
    const SIGNIN_BUTTON = '#signInSubmit';
    const ORDER_ANCHOR = '#nav-orders';

    await mouse.click(pageInstance, SIGNIN_ANCHOR_1);
    await mouse.clickAndNavigate(pageInstance, SIGNIN_ANCHOR_2);
    await keyboard.type(pageInstance, EMAIL_INPUT, CREDS.email);
    await mouse.clickAndNavigate(pageInstance, EMAIL_CONTINUE_BUTTON);
    await keyboard.type(pageInstance, PASSWORD_INPUT, CREDS.password);
    await mouse.clickAndNavigate(pageInstance, SIGNIN_BUTTON);
    await mouse.clickAndNavigate(pageInstance, ORDER_ANCHOR);

    await browser.close(browserInstance);
})();