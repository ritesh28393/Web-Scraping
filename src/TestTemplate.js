'use strict';

const puppeteer = require('puppeteer');
var fs = require('fs');

const browser = require('./puppeteerFunctions/browser.js');
const page = require('./puppeteerFunctions/page.js');
const keyboard = require('./puppeteerFunctions/keyboard.js');

(async () => {
    const browserInstance = await browser.launch(puppeteer, true);
    const pageInstance = await browser.newPage(browserInstance);

    const URL = "https://www.w3schools.com/w3css/tryw3css_templates_blog.htm";
    //const URL = "C:\\Users\\Ritesh Raj\\Desktop\\Temp\\Web-Scrapping\\src\\TestHTMLtemplate\\PlayGround.html";

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
            var maxWidthForGrouping = 20;
            var maxHeightForGrouping = 10;

            //configuration end
            //traverse depth first. FIrst process parent and then all its children (left to right)
            var tdf = (ele) => {
                $(ele).contents().each(function () {
                    if (this.nodeType == 1 && $(this).css('display') != 'none' && $(this).css('visibility') != 'hidden' && $(this).css('clip') == 'auto' && $(this).width() > minWidthElement && $(this).height() > minHeightElement) {
                        //Element
                        elements['ProcessTags'].push($(this).prop('tagName'));
                        if (!$(this).css('border').startsWith('0') || $(this).css('box-shadow') != 'none') {
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
                this.id = uuidv4();
                this.left = left;
                this.top = top;
                this.width = width;
                this.height = height;
                this.text = text ? text.trim() : '';
                this.path = path;
                this.eleType = eleType; // H(heading), I(image), A(anchor), B(has visible border box), T(text)
                this.address = address;
                this.boxId = undefined;
                this.nearestTextId = undefined; // down or right element id
                this.relatedByPathTextId = undefined;
            }
            //function
            function uuidv4() {
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
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
            //grouping
            //grouping by text
            /*
            groupIndexCounter = 0;                        
            elements['textGroup'] = elements['Data'].filter(e => e.eleType == 'T');
            elements['textGroup'][0].groupIndex = groupIndexCounter;
            for (let index = 0; index < elements['textGroup'].length; index++) {
                const self = elements['textGroup'][index];
                const next = index == elements['textGroup'].length ? undefined : elements['textGroup'][index + 1];
                if (next) {
                    //next to it and distance between the box is less than maxWidthForGrouping
                    if (self.top == next.top && next.left - self.left - self.width < maxWidthForGrouping) {
                        next.groupIndex = self.groupIndex;
                    }
                    //below to it and distance between the box is less than maxHeightForGrouping
                    else if (self.left == next.left && next.top - self.top - self.height < maxHeightForGrouping) {
                        next.groupIndex = self.groupIndex;
                    }
                    else {
                        next.groupIndex = groupIndexCounter++;
                    }
                }
            }
            */
            //grouping by selector path
            /*
            groupIndexCounter = 0;
            elements['textGroup'] = elements['Data'].filter(e => e.eleType == 'T');
            elements['textGroup'][0].groupIndex = groupIndexCounter;
            for (let index = 0; index < elements['textGroup'].length; index++) {
                const self = elements['textGroup'][index];
                const next = index == elements['textGroup'].length ? undefined : elements['textGroup'][index + 1];
                if (next) {
                    let selfSelector = self.path.split(' > ');
                    let nextSelector = next.path.split(' > ');
                    let canBeGrouped = true;
                    for (let i = 0; i < selfSelector.length - 1; i++) {
                        // for loop till parent
                        // not checking if self and next path has same length
                        if (nextSelector[i] != undefined && selfSelector[i].split(':')[0] != nextSelector[i].split(':')[0]) {
                            canBeGrouped = false;
                            break;
                        }
                    }
                    next.groupIndex = canBeGrouped ? self.groupIndex : ++groupIndexCounter;
                }
            }
            */
            //grouping by box (RIGHT NOW NOT considering height/width = 0(or some min value))
            elements['boxGroup'] = elements['Data'].filter(e => e.eleType == 'B');
            elements['textGroup'] = elements['Data'].filter(e => e.eleType == 'T');
            for (let index = 0; index < elements['boxGroup'].length; index++) {
                const boxEle = elements['boxGroup'][index];
                let x1 = boxEle.left;
                let x2 = boxEle.left + boxEle.width;
                let y1 = boxEle.top;
                let y2 = boxEle.top + boxEle.height;
                elements['textGroup'].forEach(textEle => {
                    if (textEle.left > x1 && textEle.left < x2 && textEle.top > y1 && textEle.top < y2) {
                        textEle.groupIndex = textEle.groupIndex == -1 ? index : textEle.groupIndex + ', ' + index;
                    }
                });
            }
            //processed tags
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