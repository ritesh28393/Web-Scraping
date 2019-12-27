module.exports = {
    focus: async (page, selector) => {
        await page.focus(selector);
        console.log('page focus => ', selector);
    },
    hover: async (page, selector) => {
        await page.hover(selector);
        console.log('page hover => ', selector);
    },
    click: async (page, selector) => {
        await page.click(selector);
        console.log('page click => ', selector);
    },
    clickAndNavigate: async (page, selector) => {
        await Promise.all([
            page.waitForNavigation(),  // Think it as it waits for the navigation to start and complete.
            page.click(selector)
        ]);
        console.log('page click => ', selector);
        console.log('page navigated');
    },
    select: async (page, selector, values) => {
        // https://pptr.dev/#?product=Puppeteer&version=v1.20.0&show=api-pageselectselector-values
        await page.select(selector, values);
        console.log('page select selector => ', selector);
        console.log('page select values => ', values);
    },
}