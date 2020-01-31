const { Machine } = require('xstate')
const { createModel } = require('@xstate/test')
const driver = require('./driver')

const googleMachine = Machine({
    id: 'google',
    initial: 'blank',
    states: {
        blank: {
            on: {
                VISIT_HOME: 'home'
            },
            meta: {
                test: driver.blank
            }
        },
        home: {
            on: {
                SEARCH: 'result',
                SEARCH_LUCKY: 'external_website',
                SEARCH_CALCULATOR: 'calculator'
            },
            meta: {
                test: driver.home
            }
        },
        result: {
            on: {
                SEARCH: 'result',
                SEARCH_CALCULATOR: 'calculator'
            },
            meta: {
                test: driver.result
            }
        },
        external_website: {
            on: {
                VISIT_HOME: 'home'
            },
            meta: {
                test: driver.external_website
            }
        },
        calculator: {
            on: {
                ZERO_DIVIDED_BY_ZERO: 'calculator_error',
                SEARCH: 'result'
            },
            meta: {
                test: driver.calculator
            }
        },
        calculator_error: {
            on: {
                SEARCH: 'result'
            },
            meta: {
                test: driver.calculator_error
            }
        }
    }
})

const googleModel = createModel(googleMachine).withEvents({
    VISIT_HOME: {
        exec: driver.VISIT_HOME
    },
    SEARCH: {
        exec: driver.SEARCH
    },
    SEARCH_LUCKY: {
        exec: driver.SEARCH_LUCKY
    },
    SEARCH_CALCULATOR: {
        exec: driver.SEARCH_CALCULATOR
    },
    ZERO_DIVIDED_BY_ZERO: {
        exec: driver.ZERO_DIVIDED_BY_ZERO
    }
})

module.exports = googleModel