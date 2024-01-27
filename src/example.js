/// @ts-check
// ^^ add this at the top of your Js file to add type-checking. If you document your types, it makes coding more streamlined and safe.

/**
 * jsDocs can be used for typing. Makes intellisense more useful. In VSC, just type "/**" above a function and press enter to autocomplete it.
 * @link https://jsdoc.app/
 * @param {number} num 
 * @returns {number}
 */
export const addOne = (num) => num + 1

// uncomment this line to see the power of typing + @ts-check. It should tell you that you can't use a string in a function that expects a number.
// addOne("hello")
