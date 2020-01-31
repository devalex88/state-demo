const googleModel = require('./google')
const puppeteer = require('puppeteer')

jest.setTimeout(100000)

describe('google', () => {

    const testPlans = googleModel.getShortestPathPlans()

    let page
    let browser

    beforeAll(async () => {
        browser = await puppeteer.launch({headless: false})
        page = await browser.newPage()
        await page.setViewport({ width: 1024, height: 768})
    })

    afterAll(async () => {
        browser.close()
    })
    
    testPlans.forEach(plan => {
        plan.paths.forEach(path => {
            test(path.description, async () => {
                await path.test(page)
            })
        })
    })
})