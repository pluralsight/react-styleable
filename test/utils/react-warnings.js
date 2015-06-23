/**
 * Fail tests when propType or prop warnings are printed by React
 */
let warn = console.warn
console.warn = function(warning) {
  if (/(Invalid prop|Failed propType)/.test(warning)) {
    throw new Error(warning)
  }
  warn.apply(console, arguments)
}