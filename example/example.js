import { basename } from 'path'
import { auth, checkDomains } from '../src'
import { debuglog } from 'util'

const LOG = debuglog('expensive')
const DEBUG = /expensive/.test(process.env.NODE_DEBUG)

const b = basename(__filename)
const dd = process.argv.find((a) => {
  return a.endsWith(b)
})
const i = process.argv.indexOf(dd)
const j = i + 1
const domains = process.argv.slice(j)

if (!domains.length) {
  console.log('Please enter a domain or domains')
  process.exit()
}

(async () => {
  try {
    const a = await auth({ packageName: 'example' }) // { ApiKey, UserName, ClientIp }
    const res = await checkDomains({
      ...a,
      domains,
    })
    console.log(res)
  } catch ({ stack, message }) {
    DEBUG ? LOG(stack) : console.error(message)
    process.exit(1)
  }
})()
