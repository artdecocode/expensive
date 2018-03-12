const { equal, assert } = require('zoroaster/assert')
const context = require('../context')
const expensive = require('../..')

const expensiveTestSuite = {
    context,
    'should be a function'() {
        equal(typeof expensive, 'function')
    },
    'should call package without error'() {
        assert.doesNotThrow(() => {
            expensive()
        })
    },
}

module.exports = expensiveTestSuite
