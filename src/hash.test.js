import { strict as assert } from 'assert'
import { describe, it } from 'node:test'
import { generateIndexes } from './hash.js'
import { randomBytes } from 'crypto'

const ranges = {
    a: {
        min: 1,
        max: 26,
    },
    b: {
        min: 1,
        max: 172,
    },
    c: {
        min: 1,
        max: 99,
    },
};

const sampleStrings = [
    "qro3cKSNos",
    "9aQbNapwHu",
    "V7pkZBm53O",
    "RdgubZvFxN",
    "pn8bHYjgnj",
    "jcjnEYJsVw",
    "H8zNUFjUTl",
    "abEBaLKVgG",
    "YMXEPPy0R0",
    "SrDzZujgnH",
]

const randomString = (len) => randomBytes(len).toString('hex')
const isBetween = (val, {min, max}) => val >= min && val <= max
const resultInBounds = ({a, b, c}) => {
    assert.equal(isBetween(a, ranges.a), true)
    assert.equal(isBetween(b, ranges.b), true)
    assert.equal(isBetween(c, ranges.c), true)
}

it("runs", () => {
    assert.ok(generateIndexes("1"))
})

it("generates values in bound for sample strings", () => {
    const generatedKeys = sampleStrings
        .map(x => generateIndexes(x))
    console.log(generatedKeys)
    generatedKeys.forEach(x => resultInBounds(x))
})

const randomStrings = Array.from(Array(100).keys())
    .map(x => randomString(x))
const generatedKeys = randomStrings
    .map(x => generateIndexes(x))

it("generates values in bound for 100 random strings", () => {
    generatedKeys.forEach(x => resultInBounds(x))
})

const numCompare = (a, b) => a - b;

const arrayEvenSpread = (array, { min, max }) => {
    const sum = array.reduce((acc, x) => acc += x, 0)
    const average = sum / array.length
    const expectedAverage = (max + min) / 2
    const sussyRange = {
        min: expectedAverage * 0.75,
        max: expectedAverage * 1.50,
    }
    if (isBetween(average, sussyRange)) {
        console.warn(`${average} is far from ${expectedAverage}`)
    }
}

it("shows you how sussy the spread is", () => {
    const arrayA = generatedKeys.map(x => x.a)
    console.log(arrayA.toSorted(numCompare))
    const arrayB = generatedKeys.map(x => x.b)
    console.log(arrayB.toSorted(numCompare))
    const arrayC = generatedKeys.map(x => x.c)
    console.log(arrayC.toSorted(numCompare))
})
