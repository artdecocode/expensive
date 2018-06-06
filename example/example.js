import getConfig from '../src/lib/get-config'
import checkDomains from '../src/lib/namecheap/domains/check'
import { debuglog } from 'util'

const LOG = debuglog('expensive')
const DEBUG = /expensive/.test(process.env.NODE_DEBUG)

const domains = process.argv.slice(3)

if (!domains.length) {
  console.log('Please enter a domain or domains')
  process.exit()
}

(async () => {
  try {
    const a = await getConfig({ packageName: 'example' })
    console.log('Checking %s', domains.join(', '))
    const res = await checkDomains({
      ...a,
      domains,
    })
    if (res.length) {
      console.log('The following are free: %s', res.join(', '))
    } else {
      console.log('All domains are taken')
    }
  } catch ({ stack, message }) {
    DEBUG ? LOG(stack) : console.error(message)
    process.exit(1)
  }
})()
