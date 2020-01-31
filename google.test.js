const googleModel = require('./google')
const puppeteer = require('puppeteer')

jest.setTimeout(100000)

describe('google', () => {

    googleModel.getShortestPathPlans().forEach(plan => {
        plan.paths.forEach(path => {
            test(path.description, async () => {
                const browser = await puppeteer.launch({headless: false})
                const page = await browser.newPage()
                await page.setViewport({ width: 1024, height: 768})
                await path.test(page)
                await browser.close()
            })
        })
    })
})