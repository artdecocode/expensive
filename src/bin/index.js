/* eslint-disable no-console */
import { checkDomains, auth } from '..'
import { debuglog } from 'util'

const LOG = debuglog('expensive')
const DEBUG = /expensive/.test(process.env.NODE_DEBUG)

const [,,d0, d1] = process.argv

const domain = d1 ? d1 : d0

const u = {
  domain: 'check a domain name in various startupy zones (.io, .cc, .co, .bz)',
  'domain.com': 'check a domain name',
  'domain1.com domain2.com': 'check multiple domain names',
}
const commands = Object.keys(u)
const values = Object.values(u)
const [nameLength, commandLength] = commands.reduce(([longestName = 0, longestCommand = 0], name) => {
  /** @type {string} */
  const command = u[name]
  if (command.length > longestCommand) longestCommand = command.length
  if (name.length > longestName) longestName = name.length
  return [longestName, longestCommand]
}, [])

const pad = (string, length) => {
  const l = length - string.length
  const t = Array.from({ length: l })
  const ts = t.map(_ => ' ').join('') // eslint-disable-line no-unused-vars
  const s = `${string}${ts}`
  return s
}

const usa = commands.reduce((acc, command, i) => {
  const value = values[i]
  const c = pad(command, nameLength)
  const v = pad(value, commandLength)
  const s =  `${c}\t${v}`
  return [...acc, s]
}, [])

const usage = `Usage:
  expensive
${usa.map(a => `\t${a}`).join('\n')}
`.trim()

const isSingleWord = d => !/\./.test(d)

const startupyDomains = [
  '.co',
  '.cc',
  '.io',
  '.bz',
  '.app',
]

const makeList = d => startupyDomains.map(s => `${d}${s}`)


// const usa = us.reduce((acc, length, i) => {
//   const command = commands[i]
//   const s = pad(command, i)
//   return [...acc, s]
// }, [])

;(async () => {
  if (!domain) {
    console.log(usage)
    console.log()
    process.exit(1)
  }

  const single = isSingleWord(domain)
  const domains = single ? makeList(domain) : []

  const d = single ? undefined : domain

  try {
    const a = await auth({
      global: true,
    })
    const res = await checkDomains({
      ...a,
      domain: d,
      domains,
    })
    console.log('The following are free: %s', res.join(', '))
  } catch ({ stack, message }) {
    DEBUG ? LOG(stack) : console.error(message)
    process.exit(1)
  }
})()

