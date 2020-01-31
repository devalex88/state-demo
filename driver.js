const driver = {

    blank: async page => {
    },

    home: async page => {
        expect(page.url()).toBe('https://www.google.com/')
    },

    result: async page => {
        return await page.waitFor('#resultStats')
    },

    external_website: async page => {
        expect(page.url()).toEqual(expect.not.stringContaining('https://www.google.com'))
    },

    calculator: async page => {
        return await page.waitFor('[data-async-context="query:calculator"]')
    },

    calculator_error: async page => {
        const element = await page.$('#cwos')
        const text = await page.evaluate(element => element.textContent, element)
        expect(text).toBe('Error')
    },

    VISIT_HOME: async page => {
        await page.goto('https://www.google.com', )
    },

    SEARCH: async page => {
        await page.type('input[name=q]', 'test')
        await page.keyboard.press('Enter')
    },

    SEARCH_LUCKY: async page => {
        await page.type('input[name=q]', 'vnexpress.net')
        await page.keyboard.press('Escape')
        await page.click('#tsf > div:nth-child(2) > div.A8SBwf > div.FPdoLc.tfB0Bf > center > input.RNmpXc')
        await page.waitFor(4000)
    },

    SEARCH_CALCULATOR: async page => {
        await page.type('input[name=q]', 'calculator')
        await page.keyboard.press('Enter')
    },

    ZERO_DIVIDED_BY_ZERO: async page => {
        await page.click('#cwmcwd > div > div > div.SKWP2e > div > table.ElumCf > tbody > tr:nth-child(5) > td:nth-child(1) > div > div')
        await page.click('#cwmcwd > div > div > div.SKWP2e > div > table.ElumCf > tbody > tr:nth-child(2) > td:nth-child(4) > div > div')
        await page.click('#cwmcwd > div > div > div.SKWP2e > div > table.ElumCf > tbody > tr:nth-child(5) > td:nth-child(1) > div > div')
        await page.click('#cwmcwd > div > div > div.SKWP2e > div > table.ElumCf > tbody > tr:nth-child(5) > td:nth-child(3) > div > div')
        await page.waitFor(4000)
    }
}

module.exports = driver