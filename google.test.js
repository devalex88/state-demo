const { Machine } = require('xstate')
const { createModel } = require('@xstate/test')
const puppeteer = require('puppeteer')

const googleMachine = Machine({
    id: 'google',
    initial: 'blank',
    states: {
        blank: {
            on: {
                VISIT_HOME: 'home'
            },
            meta: {
                test: async page => {
                }
            }
        },
        home: {
            on: {
                SEARCH: 'result',
                SEARCH_LUCKY: 'external_website',
                SEARCH_CALCULATOR: 'calculator'
            },
            meta: {
                test: async page => {
                    expect(page.url()).toBe('https://www.google.com/')
                }
            }
        },
        result: {
            on: {
                SEARCH: 'result',
                SEARCH_CALCULATOR: 'calculator'
            },
            meta: {
                test: async page => {
                    return await page.waitFor('#resultStats')
                }
            }
        },
        external_website: {
            on: {
                VISIT_HOME: 'home'
            },
            meta: {
                test: async page => {
                    expect(page.url()).toEqual(expect.not.stringContaining('https://www.google.com'))
                }
            }
        },
        calculator: {
            on: {
                ZERO_ON_ZERO: 'calculator_error',
                SEARCH: 'result'
            },
            meta: {
                test: async page => {
                    return await page.waitFor('[data-async-context="query:calculator"]')
                }
            }
        },
        calculator_error: {
            on: {
                SEARCH: 'result'
            },
            meta: {
                test: async page => {
                    const element = await page.$('#cwos')
                    const text = await page.evaluate(element => element.textContent, element)
                    expect(text).toBe('Error')
                }
            }
        }
    }
})

const googleModel = createModel(googleMachine).withEvents({
    VISIT_HOME: {
        exec: async page => {
            await page.goto('https://www.google.com', )
        }
    },
    SEARCH: {
        exec: async page => {
            await page.type('input[name=q]', 'test')
            await page.keyboard.press('Enter')
        }
    },
    SEARCH_LUCKY: {
        exec: async page => {
            await page.type('input[name=q]', 'vnexpress.net')
            await page.keyboard.press('Escape')
            await page.click('#tsf > div:nth-child(2) > div.A8SBwf > div.FPdoLc.tfB0Bf > center > input.RNmpXc')
            await page.waitFor(4000)
        }
    },
    SEARCH_CALCULATOR: {
        exec: async page => {
            await page.type('input[name=q]', 'calculator')
            await page.keyboard.press('Enter')
        }
    },
    ZERO_ON_ZERO: {
        exec: async page => {
            await page.click('#cwmcwd > div > div > div.SKWP2e > div > table.ElumCf > tbody > tr:nth-child(5) > td:nth-child(1) > div > div')
            await page.click('#cwmcwd > div > div > div.SKWP2e > div > table.ElumCf > tbody > tr:nth-child(2) > td:nth-child(4) > div > div')
            await page.click('#cwmcwd > div > div > div.SKWP2e > div > table.ElumCf > tbody > tr:nth-child(5) > td:nth-child(1) > div > div')
            await page.click('#cwmcwd > div > div > div.SKWP2e > div > table.ElumCf > tbody > tr:nth-child(5) > td:nth-child(3) > div > div')
            await page.waitFor(4000)
        }
    }
})

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

    test('should have full coverage', () => {
        return googleModel.testCoverage()
    })
})