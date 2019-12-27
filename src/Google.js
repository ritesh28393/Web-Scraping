'use strict';

const puppeteer = require('puppeteer');

const browser = require('./puppeteerFunctions/browser.js');
const page = require('./puppeteerFunctions/page.js');
const keyboard = require('./puppeteerFunctions/keyboard.js');

(async () => {
    const browserInstance = await browser.launch(puppeteer, true);
    const pageInstance = await browser.newPage(browserInstance);

    const GOOGLE_URL = "https://www.google.com/";
    const SEARCH_INPUT = "#tsf > div:nth-child(2) > div.A8SBwf > div.RNNXgb > div > div.a4bIc > input";
    const RESULTS = "#rso > div:nth-child(3) > div";

    try {
        await page.goto(pageInstance, GOOGLE_URL);
        await keyboard.type(pageInstance, SEARCH_INPUT, 'web scraping');
        await keyboard.press(pageInstance, 'Enter');
        await page.waitForSelector(pageInstance, RESULTS);

        const EVALUATIONFUNC = () => {
            const RESULTS = "#rso > div:nth-child(3) > div";
            var data = [];
            data.push({
                'index': 'NA',
                'value': $(RESULTS).text()
            });
            $(RESULTS).children().each((i, ele) => {
                data.push({
                    'index': i,
                    'value': $(this).find("div > div > div.r").html()
                });
            });
            return data;
        };

        const pageEvaluationResult = await page.addJQueryAndEvaluate(pageInstance, EVALUATIONFUNC);

        for(var i = 0; i < pageEvaluationResult.length; i++) {
            console.log('INDEX: ' + pageEvaluationResult[i].index + ' VALUE: ' + pageEvaluationResult[i].value);
        }
    }
    catch (err) {
        console.error(err.message);
    }
    finally {
        await browser.close(browserInstance);
    }
})();