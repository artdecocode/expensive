export const validateDomains = (arr) => arr.reduce((acc, current) => {
  return acc && typeof current == 'string'
}, true)

export const startupyDomains = [
  '.co',
  '.cc',
  '.io',
  '.bz',
  '.app',
]

export const isSingleWord = d => !/\./.test(d)

export const makeStartupyList = d => startupyDomains.map(s => `${d}${s}`)
