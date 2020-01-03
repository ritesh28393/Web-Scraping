'use strict';

const puppeteer = require('puppeteer');
var fs = require('fs');

const browser = require('./puppeteerFunctions/browser.js');
const page = require('./puppeteerFunctions/page.js');
const keyboard = require('./puppeteerFunctions/keyboard.js');

(async () => {
    const browserInstance = await browser.launch(puppeteer, true);
    const pageInstance = await browser.newPage(browserInstance);

    const URL = "https://www.w3schools.com/w3css/tryw3css_templates_band.htm";
    //"C:\\Users\\Ritesh Raj\\Desktop\\Temp\\Web-Scrapping\\src\\TestHTMLtemplate\\PlayGround.html";

    try {
        await page.goto(pageInstance, URL);
        await page.waitForSelector(pageInstance, 'body');

        const EVALUATIONFUNC = () => {
            var elements = {}; // fullTagName : new ElementInfoObject()
            //traverse depth first. FIrst process all children and comes to parent
            //before recursive call, traverse top to bottom (all the way) then left to right
            //after recursive call, traverse in left to right (all the way) then goes up
            var tdf = (ele) => {
                $(ele).children().each(function () {
                    if ($(this).pruneText() != '') {
                        //setting identifier
                        switch ($(this).prop('tagName')) {
                            case 'LI':
                            case 'DIV':
                                let loneText = $(this).clone().children().remove().end().pruneText();
                                if (loneText != '') {
                                    $(this).append('<h6>' + loneText + '</h6>');
                                    $(this).setIdentifier();
                                }
                                else {
                                    let textCounter = 0;
                                    let self = this;
                                    $(this).children().each(function () {
                                        if ($(this).pruneText() != '') {
                                            if (/H[1-6]/.test($(this).prop('tagName'))) {
                                                $(self).setIdentifier();
                                                return false;
                                            }
                                            else {
                                                if ($(this).prop('tagName') != 'BUTTON') { textCounter++; }
                                                if (textCounter > 1) {
                                                    $(self).setIdentifier();
                                                    return false;
                                                }
                                            }
                                        }
                                    })
                                }
                                break;
                            case 'ARTICLE':
                            case 'SECTION':
                            case 'FOOTER':
                            case 'HEADER':
                            case 'TABLE':
                            case 'TR':
                            case 'UL':
                            case 'OL':
                                $(this).setIdentifier();
                                break;
                            case 'IMG':
                                //TODO: if the Parent element has no identifier, then add one
                                break;
                        }
                        //recursive call
                        tdf($(this));
                        switch ($(this).prop('tagName')) {
                            case 'H1':
                            case 'H2':
                            case 'H3':
                            case 'H4':
                            case 'H5':
                            case 'H6':
                                WriteToElementObject($(this), 'heading');
                                break;
                            case 'A':
                                WriteToElementObject($(this), 'anchor');
                                break;
                            case 'STRONG':
                            case 'EM':
                            case 'I':
                            case 'SPAN':
                                $(this).parent().prop('tagName') == 'P' ? $(this).replaceWith($(this).pruneText()) : WriteToElementObject($(this), 'text');
                                break;
                            case 'TH':
                            case 'TD':
                            case 'P':
                                WriteToElementObject($(this), 'text');
                                break;
                            case 'UL':
                            case 'OL':
                            case 'LI':
                            case 'TABLE':
                            case 'TR':
                            case 'ARTICLE':
                            case 'SECTION':
                            case 'FOOTER':
                            case 'HEADER':
                                WriteToElementObject($(this), 'container');
                                break;
                            case 'DIV':
                                if ($(this).getIdentifier() != undefined) {
                                    WriteToElementObject($(this), 'container');
                                }
                                break;
                            case 'IMG':
                                WriteToElementObject($(this), 'image');
                                break;
                            default:
                                elements['NoProcessTag'] += ', ' + $(this).prop('tagName');
                                break;
                        }
                    }
                });
            };
            //mark the container parent for a given current element(child)
            function WriteToElementObject(currentEle, FunctionType) {
                // fullTagName : new ElementInfoObject()
                let fullTagName = undefined;
                currentEle.parents().each(function () {
                    fullTagName = $(this).getIdentifier();
                    if (fullTagName != undefined) {
                        if (elements[fullTagName] == undefined) {
                            elements[fullTagName] = new ElementInfoObject($(this).prop('tagName'));
                        }
                        return false;
                    }
                });
                switch (FunctionType) {
                    case 'text':
                        elements[fullTagName].texts.push(currentEle.pruneText());
                        break;
                    case 'heading':
                        elements[fullTagName].headings.push(currentEle.pruneText());
                        break;
                    case 'anchor':
                        elements[fullTagName].anchors.push(new AnchorObject(currentEle.pruneText(), currentEle.attr('href')));
                        break;
                    case 'image':
                        elements[fullTagName].images.push(new ImageObject(currentEle.attr('alt'), currentEle.attr('src')));
                        break;
                    case 'container':
                        elements[fullTagName].children.push($(currentEle).getIdentifier());
                        break;
                }
            }
            //objects
            function ElementInfoObject(shortTagName) {
                this.shortTagName = shortTagName; // string
                this.images = []; // image type
                this.headings = []; // string type
                this.anchors = []; // anchor type
                this.texts = []; // string type
                this.children = []; // list of fullTagNames(strings) (tagName + '#' + idName + '.' + className)
            }
            function ImageObject(alternateText, source) {
                this.alternateText = alternateText; // string
                this.source = source; // string
            }
            function AnchorObject(text, href) {
                this.text = text; // string
                this.href = href; // string
            }
            $.fn.extend({
                setIdentifier: function () {
                    let tagName = this.prop('tagName');
                    let randNo = Math.floor(Math.random() * 100) + 1;
                    let idName = this.attr('id') == undefined ? 'id-' + randNo : this.attr('id');
                    randNo = Math.floor(Math.random() * 100) + 1;
                    //let className = this.attr('class') == undefined ? 'cls-' + randNo : this.attr('class');
                    let className = 'cls-' + randNo;
                    this.data('IDENTIFIER', tagName + '#' + idName + '.' + className);
                },
                getIdentifier: function () {
                    return this.data('IDENTIFIER');
                },
                pruneText: function () {
                    return this.text().replace(/(\r\n|\n|\r)/gm, "").replace(/\s+/g, ' ').trim();
                }
            })
            $('body').setIdentifier();
            tdf($('body'));
            return elements;
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