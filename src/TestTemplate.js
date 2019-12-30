'use strict';

const puppeteer = require('puppeteer');
var fs = require('fs');

const browser = require('./puppeteerFunctions/browser.js');
const page = require('./puppeteerFunctions/page.js');
const keyboard = require('./puppeteerFunctions/keyboard.js');

(async () => {
    const browserInstance = await browser.launch(puppeteer, true);
    const pageInstance = await browser.newPage(browserInstance);

    const URL = "C:\\Users\\Ritesh Raj\\Desktop\\Temp\\Web-Scrapping\\src\\TestHTMLtemplate\\Pilot.html";

    try {
        await page.goto(pageInstance, URL);
        await page.waitForSelector(pageInstance, 'body');

        const EVALUATIONFUNC = () => {
            //traverse depth first
            var textData = {};
            var counter = 1;
            var sentenceTag = ['P', 'SPAN', 'B', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'];
            var containerTag = ['DIV'];
            var tdf = (ele) => {
                $(ele).children().each(function () {
                    // attaching data to the DIV element
                    if (containerTag.indexOf($(this).prop('tagName')) != -1) {
                        $(this).data('divIdentifier', '##div' + counter);
                        counter += 1;
                    }
                    tdf($(this));
                    //sentence tag
                    if (sentenceTag.indexOf($(this).prop('tagName')) != -1) {
                        //check parent tag
                        if (sentenceTag.indexOf($(this).parent().prop('tagName')) != -1) {
                            $(this).replaceWith($(this).text());
                        }
                        else {
                            textData[$(this).parents('div').data('divIdentifier')] += ', ' + $(this).text().trim();
                        }
                    }
                    //container tag
                    else if (containerTag.indexOf($(this).prop('tagName')) != -1) {
                        let text = $(this).clone().children().remove().end().text().trim();
                        if (text != '') {
                            textData[$(this).data('divIdentifier')] += ', ' + text;
                        }
                        // include child div in its textData
                        let self = this;
                        $(this).children().each(function(){
                            if (containerTag.indexOf($(this).prop('tagName')) != -1){
                                textData[$(self).data('divIdentifier')] += ', ' + $(this).data('divIdentifier');
                            }
                        });
                    }
                });
            };
            tdf($('body'));
            return textData;
        };

        const pageEvaluationResult = await page.addJQueryAndEvaluate(pageInstance, EVALUATIONFUNC);

        fs.writeFile('TestTemplateResult.txt', JSON.stringify(pageEvaluationResult, null, 4), function (err) {
            if (err) throw err;
            console.log('Saved!');
        });
    }
    catch (err) {
        console.error(err.message);
    }
    finally {
        await browser.close(browserInstance);
    }
})();