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
            var elements = {}; 
            elements['ProcessTags'] = [];
            elements['Data'] = [];
            //configuration start
            var minWidthElement = 10;
            var minHeightElement = 10;
            var maxLineWidthForGroupig = 20;

            //configuration end
            //traverse depth first. FIrst process parent and then all its children (left to right)
            var tdf = (ele) => {
                $(ele).contents().each(function () {
                    if (this.nodeType == 1 && $(this).css('display') != 'none' && $(this).css('visibility') != 'hidden' && $(this).css('clip') == 'auto' && $(this).width() > minWidthElement && $(this).height() > minHeightElement) {
                        //Element
                        elements['ProcessTags'].push($(this).prop('tagName'));
                        if (!$(this).css('border').startsWith('0')) {
                            //if value is '' that means border-bottom/top/left/right has some value
                            //HR has a border property (It is like a border with 0 height)
                            elements['Data'].push(new AnyElement(
                                $(this).offset().left,
                                $(this).offset().top,
                                $(this).width(),
                                $(this).height(),
                                '',
                                $(this).getPath(),
                                'B',
                            ));
                        }
                        if (/H[1-6]/.test($(this).prop('tagName'))) {
                            elements['Data'].push(new AnyElement(
                                $(this).offset().left,
                                $(this).offset().top,
                                $(this).width(),
                                $(this).height(),
                                $(this).text(),
                                $(this).getPath(),
                                'H'
                            ));
                            return;
                        }
                        else if ($(this).prop('tagName') == 'A') {
                            elements['Data'].push(new AnyElement(
                                $(this).offset().left,
                                $(this).offset().top,
                                $(this).width(),
                                $(this).height(),
                                $(this).text(),
                                $(this).getPath(),
                                'A',
                                $(this).attr('href')
                            ));
                        }
                        else if ($(this).prop('tagName') == 'IMG') {
                            elements['Data'].push(new AnyElement(
                                $(this).offset().left,
                                $(this).offset().top,
                                $(this).width(),
                                $(this).height(),
                                $(this).attr('alt'),
                                $(this).getPath(),
                                'I',
                                $(this).attr('src')
                            ));
                        }
                        else if (['SCRIPT', 'NOSCRIPT', 'STYLE', 'FORM', 'svg'].includes($(this).prop('tagName'))) {
                            return;
                        }
                        tdf($(this));
                    }
                    else if (this.nodeType == 3 && $.trim(this.nodeValue).length) {
                        //Text
                        self = $(this).wrap('<span style="color: Red"/>').parent();
                        if (self.width() > minWidthElement && self.height() > minHeightElement) {
                            elements['Data'].push(new AnyElement(
                                self.offset().left,
                                self.offset().top,
                                self.width(),
                                self.height(),
                                self.text(),
                                self.getPath(),
                                'T'
                            ));
                        }
                    }
                });
            };
            //object
            function AnyElement(left, top, width, height, text, path, eleType, address) {
                this.left = left;
                this.top = top;
                this.width = width;
                this.height = height;
                this.text = text.trim();
                this.path = path;
                this.eleType = eleType; // H(heading), I(image), A(anchor), B(has visible border box), T(text)
                this.address = address;
            }
            //jquery custom function
            $.fn.getPath = function () {
                if (this.length != 1) throw 'Requires one element.';
                var path, node = this;
                while (node.length) {
                    var realNode = node[0];
                    var name = (
                        realNode.localName ||
                        realNode.tagName ||
                        realNode.nodeName
                    );
                    if (!name || name == '#document') break;
                    name = name.toLowerCase();
                    if (realNode.id) {
                        return name + '#' + realNode.id + (path ? ' > ' + path : '');
                    } else if (realNode.className) {
                        name += '.' + realNode.className.split(/\s+/).join('.');
                    }
                    var parent = node.parent(), siblings = parent.children(name);
                    if (siblings.length > 1) name += ':nth-child(' + (siblings.index(node) + 1) + ')';
                    path = name + (path ? ' > ' + path : '');
                    node = parent;
                }
                return path;
            };
            tdf($('body'));
            elements['ProcessTags'] = elements['ProcessTags'].filter((v, i, a) => a.indexOf(v) === i);
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