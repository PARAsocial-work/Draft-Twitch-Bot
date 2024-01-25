/**
 * You can put your test files in a __tests__ folder, but I usually just put them alongside my actual source files.
 * If a test touches multiple systems/files, you'd chuck them in a __tests__ folder.
 */

import { strict as assert } from 'assert'
import { it, describe } from 'node:test'

/**
 * the .env file has to be specified in your node runner. I've changed the package.json to reflect this.
 * you can use it for a bunch of things - but it's always going to be a string, I think. Probably.
 * remember to make the file .env from .env-example for this test to function!
 */  

describe("uses environment variable", () => {
    it("imports environment variable", () => {
        const val = process.env.ENV_SETUP
        assert.equal(val, "yes")
    })
    it("can be used for control flow", () => {
        const mode = process.env.ENV_SETUP
        let counter = 0
        let is_development = false
        let is_production = false

        if( mode == "development" ) {
            // It's common to use dev/prod mode to control if you want it to be logged or not.
            counter = counter + 1
            is_development = true
        } else {
            counter = counter + 1
            is_production = true
        }

        assert.equal(counter, 1)

        if ( mode == "development" ) {
            assert.equal(is_development, true)
        } else {
            assert.equal(is_production, true)
        }
    })
})

