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
    await page.goto(pageInstance, 'https://www.amazon.in/ap/signin?_encoding=UTF8&ignoreAuthState=1&openid.assoc_handle=inflex&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.mode=checkid_setup&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.ns.pape=http%3A%2F%2Fspecs.openid.net%2Fextensions%2Fpape%2F1.0&openid.pape.max_auth_age=0&openid.return_to=https%3A%2F%2Fwww.amazon.in%2F%3Fref_%3Dnav_signin&switch_account=');

    const EMAIL_INPUT = '#ap_email';
    const EMAIL_CONTINUE_BUTTON = '#continue';
    const PASSWORD_INPUT = '#ap_password';
    const SINGIN_BUTTON = '#signInSubmit';
    const ORDER_ANCHOR = '#nav-orders';

    await keyboard.type(pageInstance, EMAIL_INPUT, CREDS.email);
    await mouse.clickAndNavigate(pageInstance, EMAIL_CONTINUE_BUTTON);
    await keyboard.type(pageInstance, PASSWORD_INPUT, CREDS.password);
    await mouse.clickAndNavigate(pageInstance, SINGIN_BUTTON);
    await mouse.clickAndNavigate(pageInstance, ORDER_ANCHOR);

    await browser.close(browserInstance);
})();