'use strict';

const puppeteer = require('puppeteer');
var fs = require('fs');

const browser = require('./puppeteerFunctions/browser.js');
const page = require('./puppeteerFunctions/page.js');
const keyboard = require('./puppeteerFunctions/keyboard.js');

(async () => {
    const browserInstance = await browser.launch(puppeteer, true);
    const pageInstance = await browser.newPage(browserInstance);

    const GOOGLE_URL = "https://www.google.com/";
    const SEARCH_INPUT = "#tsf > div:nth-child(2) > div.A8SBwf > div.RNNXgb > div > div.a4bIc > input";
    const SEARCH_QUERY = "web scraping";
    const SELECTOR = "#rso";

    try {
        await page.goto(pageInstance, GOOGLE_URL);
        await keyboard.type(pageInstance, SEARCH_INPUT, SEARCH_QUERY);
        await keyboard.press(pageInstance, 'Enter');
        await page.waitForSelector(pageInstance, SELECTOR);

        const EVALUATIONFUNC = () => {
            // remove tags
            var removeTag = ['script', 'noscript', 'embed', 'object', 'style', 'iframe', 'br', 'hr', 'template', 'form', 'audio', 'video', 'dialog', 'svg', 'img'];
            var removeTagData = [];
            removeTag.forEach(tag => {
                let len = $(tag).length;
                if (len > 0) {
                    $(tag).remove();
                    removeTagData.push({
                        'tag': tag,
                        'count': len
                    })
                }
            });
            // remove attributes
            var removeAttr = ['id', 'class', 'style'];
            //traverse depth first
            var textData = [];
            var tdf = (ele) => {
                $(ele).children().each(function () {
                    // remove attributes
                    removeAttr.forEach(attr => {
                        $(this).attr(attr, null);
                    });
                    tdf($(this));
                    let text = $(this).clone().children().remove().end().text().trim();
                    if (text != '') {
                        textData.push(text);
                    }
                });
            };
            tdf($('body'));
            return {
                'removeTagData': removeTagData,
                'textData': textData,
                'body': $('body').html()
            };
        };

        const pageEvaluationResult = await page.addJQueryAndEvaluate(pageInstance, EVALUATIONFUNC);

        fs.writeFile('GoogleResult.txt', JSON.stringify(pageEvaluationResult, null, 4), function (err) {
            if (err) throw err;
            console.log('Saved!');
          });
        /*
        for (var key in pageEvaluationResult) {
            if (pageEvaluationResult.hasOwnProperty(key)) {
                console.log(key, pageEvaluationResult[key]);
            }
        }
        */
    }
    catch (err) {
        console.error(err.message);
    }
    finally {
        await browser.close(browserInstance);
    }
})();