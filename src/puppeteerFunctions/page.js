module.exports = {
    close: async (page) => {
        await page.close();
        console.log('page has closed => ', page);
    },
    htmlString: async (page) => {
        const content = await page.content();
        console.log('page content => ', content);
        return content;
    },
    emulateDevice: async (puppeteer, page, deviceName) => {
        // https://pptr.dev/#?product=Puppeteer&version=v1.20.0&show=api-pageemulateoptions
        // https://github.com/GoogleChrome/puppeteer/blob/master/lib/DeviceDescriptors.js
        const device = puppeteer.devices[deviceName];
        await page.emulate(device);
        console.log('page has emulated');
    },
    evalute: async (page, func) => {
        // https://pptr.dev/#?product=Puppeteer&version=v1.20.0&show=api-pageevaluatepagefunction-args
        await page.evaluate(func);
        console.log('page has evaluated function');
    },
    goto: async (page, url) => {
        await page.goto(url);
        console.log('page goto => ', url);
    },
    generatePDFWithPrintCssMedia: async (page, filePath) => {
        // https://pptr.dev/#?product=Puppeteer&version=v1.20.0&show=api-pagepdfoptions
        await page.pdf({ "path": filePath });
        console.log('page PDF With Print Css Media => ', filePath);
    },
    generatePDFWithScreenMedia: async (page, filePath) => {
        // https://pptr.dev/#?product=Puppeteer&version=v1.20.0&show=api-pagepdfoptions
        await page.emulateMedia('screen');
        await page.pdf({ "path": filePath });
        console.log('page PDF With Screen Media => ', filePath);
    },
    screenshot: async (page, filePath, fullPageBool = false) => {
        await page.screenshot({
            "path": filePath,
            "fullPage": fullPageBool
        });
        console.log('page screeshot => ', filePath);
    },
    title: async (page) => {
        const titleString = await page.title();
        console.log('page title => ', titleString);
        return titleString;
    },
    url: async (page) => {
        const urlString = await page.url();
        console.log('page url => ', urlString);
        return urlString;
    },
    waitForTimeout: async (page, timeSec) => {
        await page.waitFor(timeSec);
        console.log('page wait for timeout => ', timeSec);
    },
    waitForNavigation: async (page, timeSec, waitUntilOption = null) => {
        // https://pptr.dev/#?product=Puppeteer&version=v1.20.0&show=api-pagewaitfornavigationoptions
        const load = "load"; // consider navigation to be finished when the load event is fired.
        const domcontentloaded = "domcontentloaded"; // consider navigation to be finished when the DOMContentLoaded event is fired.
        const networkidle0 = "networkidle0"; // consider navigation to be finished when there are no more than 0 network connections for at least 500 ms.
        const networkidle2 = "networkidle2"; // consider navigation to be finished when there are no more than 2 network connections for at least 500 ms.
        if (waitUntilOption == null) {
            waitUntilOption = load;
        }
        await page.waitForNavigation({ "waitUntil": waitUntilOption });
        console.log('page wait for Navigation');
    },
    waitForSelector: async (page, selector) => {
        await page.waitForSelector(selector);
        console.log('page wait for selector => ', selector);
    }
}