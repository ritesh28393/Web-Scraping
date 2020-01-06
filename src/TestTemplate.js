'use strict';

const puppeteer = require('puppeteer');
var fs = require('fs');

const browser = require('./puppeteerFunctions/browser.js');
const page = require('./puppeteerFunctions/page.js');
const keyboard = require('./puppeteerFunctions/keyboard.js');

(async () => {
    const browserInstance = await browser.launch(puppeteer, true);
    const pageInstance = await browser.newPage(browserInstance);

    //const URL = "https://www.amazon.com.au/Rip-Curl-Womens-Plains-TEE/dp/B07TWB5355/ref=br_asw_pdt-10/355-6876911-7043760?pf_rd_m=ANEGB3WVEVKZB&pf_rd_s=&pf_rd_r=7HHSB45DWCFCWBG12N5D&pf_rd_t=36701&pf_rd_p=34994ded-8732-4a24-9b68-d51f6bcb05fd&pf_rd_i=desktop";
    const URL = "C:\\Users\\Ritesh Raj\\Desktop\\Temp\\Web-Scrapping\\src\\TestHTMLtemplate\\PlayGround.html";

    try {
        await page.goto(pageInstance, URL);
        await page.waitForSelector(pageInstance, 'body');

        const EVALUATIONFUNC = () => {
            var elements = {}; // fullTagName : new ElementInfoObject()
            elements['nonProcessTags'] = [];
            elements['logs'] = [];
            //traverse depth first. FIrst process all children and comes to parent
            //before recursive call, traverse top to bottom (all the way) then left to right
            //after recursive call, traverse in left to right (all the way) then goes up
            var tdf = (ele) => {
                $(ele).contents().each(function () {
                    //setting identifier
                    let self = this;
                    if (self.nodeType != 3 && self.nodeType != 1) {
                        return;
                    }
                    if ($(self).pruneText().length < 1) {
                        return;
                    }
                    if (self.nodeType == 3) {
                        if ($(self).siblings().length > 0) {
                            self = $(self).wrap('<p></p>').parent();
                        }
                        else {
                            return;
                        }
                    }
                    if ($(self).width() < 10 || $(self).height() < 10) {
                        return;
                    }
                    if (['SCRIPT', 'NOSCRIPT', 'STYLE'].includes($(self).prop('tagName'))) {
                        return;
                    }
                    $(self).setIdentifier();
                    /*
                    switch ($(this).prop('tagName')) {
                        case 'ARTICLE':
                        case 'SECTION':
                        case 'FOOTER':
                        case 'HEADER':
                        case 'DIV':
                            $(this).contents().filter(function () { return this.nodeType == 3 && $(this).pruneText().length > 1; }).wrap("<p></p>");
                        case 'TABLE':
                        case 'TR':
                        case 'UL':
                        case 'OL':
                            $(this).setIdentifier();
                            break;
                        case 'IMG':
                            //TODO: if the Parent element has no identifier, then add one
                            break;
                        case 'P':
                            let pContent = $(this).pruneText();
                            $(this).html(pContent);
                            break;
                        default:
                            $(this).children().each(function () {
                                if (/H[1-6]/.test($(this).prop('tagName'))) {
                                    $(this).setIdentifier();
                                    return false;
                                }
                            })
                            break;
                    }
                    */
                    //recursive call
                    tdf($(self));
                    switch ($(self).prop('tagName')) {
                        case 'H1':
                        case 'H2':
                        case 'H3':
                        case 'H4':
                        case 'H5':
                        case 'H6':
                            WriteToElementObject($(self), 'heading');
                            break;
                        case 'A':
                            WriteToElementObject($(self), 'anchor');
                            $(self).replaceWith($(self).text());
                            break;
                        case 'IMG':
                            WriteToElementObject($(self), 'image');
                            break;
                        default:
                            WriteToElementObject($(self), 'container');
                            elements['nonProcessTags'].push($(self).prop('tagName'));
                            break;
                    }
                });
            };
            //mark the container parent for a given current element(child)
            function WriteToElementObject(currentEle, FunctionType) {
                // parentFullTagName : new ElementInfoObject()
                let parentFullTagName;
                currentEle.parents().each(function () {
                    if ($(this).getIdentifier() != undefined) {
                        parentFullTagName = $(this).getIdentifier();
                        elements['logs'].push('prt=>' + parentFullTagName + ' & curr=>' + currentEle.prop('tagName') + ' & Fun=>' + FunctionType);
                        if (elements[parentFullTagName] == undefined) {
                            elements[parentFullTagName] = new ElementInfoObject($(this).prop('tagName'));
                        }
                        return false;
                    }
                })
                let text, href;
                switch (FunctionType) {
                    case 'heading':
                        elements[parentFullTagName].headings.push(currentEle.pruneText());
                        break;
                    case 'anchor':
                        text = currentEle.pruneText();
                        href = currentEle.attr('href');
                        if (text.length > 1 && href != undefined && !href.startsWith('#')) {
                            elements[parentFullTagName].anchors.push(new AnchorObject(text, href));
                        }
                        break;
                    case 'image':
                        elements[parentFullTagName].images.push(new ImageObject(currentEle.attr('alt'), currentEle.attr('src')));
                        break;
                    case 'container':
                        if ($(currentEle).html() == $(currentEle).text()) {
                            elements[parentFullTagName].texts.push(currentEle.pruneText());
                            break;
                        }
                        childFullTagName = $(currentEle).getIdentifier();
                        if (elements[childFullTagName] != undefined) {
                            if (elements[childFullTagName].headings.length > 0 || elements[childFullTagName].children.length > 1) {
                                elements[parentFullTagName].children.push($(currentEle).getIdentifier());
                            }
                            else {
                                elements['logs'].push('moving data to [' + parentFullTagName + '] from [' + childFullTagName + ']');
                                elements[childFullTagName].images.reverse().forEach(function (item) {
                                    elements[parentFullTagName].images.unshift(item);
                                });
                                elements[childFullTagName].anchors.reverse().forEach(function (item) {
                                    elements[parentFullTagName].anchors.unshift(item);
                                });
                                elements[childFullTagName].texts.reverse().forEach(function (item) {
                                    elements[parentFullTagName].texts.unshift(item);
                                });
                                elements[childFullTagName].children.reverse().forEach(function (item) {
                                    elements[parentFullTagName].children.unshift(item);
                                });
                                elements[childFullTagName] = undefined;
                            }
                        }
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
            // removing duplicates from elements['nonProcessTags']
            elements['nonProcessTags'] = elements['nonProcessTags'].filter(function (item, pos) {
                return elements['nonProcessTags'].indexOf(item) == pos;
            });
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