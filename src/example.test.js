import { strict as assert } from 'assert'
import { describe, it } from 'node:test'
import { addOne } from './example.js'

/**
 * Best practise: 1:1 test:src file. Your src files should have exported functions/classes you can use.
 * Best practise: Only test the outer functionality of your export (what comes in, what comes out). Do not test inner functionality.
 * use npm test for a single run, 
 * and npm run test:watch to put your terminal in watch mode.
 * Have a look at the assert library
 * @link https://nodejs.org/api/assert.html#assert
 */

describe("does things", () => {
    it("asserts that hello is hello", () => {
        assert.equal("hello", "hello")
    })
    it("asserts that one is NOT 1", () => {
        assert.notEqual("one", 1)
    })
})

describe("can test imported functions", () => {
    it("addOne adds one", () => {
        assert.equal(addOne(1), 2)
    })
    it("addOne used twice adds two", () => {
        let val = 1
        val = addOne(val)
        val = addOne(val)
        assert.equal(val, 3)
    })
})
