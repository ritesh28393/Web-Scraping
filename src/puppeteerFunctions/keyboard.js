module.exports = {
    type: async (page, selector, text, delaySec = 0) => {
        await page.type(selector, text, { "delay": delaySec });
        console.log('page keyboard focus => ', selector);
        console.log('page keyboard type => ', text);
        console.log('page keyboard delay in seconds => ', delaySec);
    },
    press: async (page, key) => {
        await page.keyboard.press(key);
        console.log('page keyboard press key => ', key);
    }
}