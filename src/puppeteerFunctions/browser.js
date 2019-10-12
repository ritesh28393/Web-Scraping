module.exports = {
    launch: async (puppeteer, headlessBool) => {
        const browser = await puppeteer.launch({
            "headless": headlessBool
        });
        console.log('browser has launched');
        return browser;
    },
    newPage: async (browser) => {
        const page = await browser.newPage();
        console.log('page has created');
        return page;
    },
    pages: async (browser) => {
        const pages = await browser.pages();
        console.log('total number if pages => ', pages.length);
        return pages;
    },
    close: async (browser) => {
        await browser.close();
        console.log('browser has closed');
    }
}