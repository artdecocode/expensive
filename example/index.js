import Namecheap, { getConfig } from '../src'
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
    // use `.expensive-example.rc` file
    // pass `global` to read `.expensiverc` instead
    const Auth = await getConfig({ packageName: 'example' })

    const nc = new Namecheap(Auth)
    const check = await nc.domains.check({ domains })
    console.log(check)
  } catch ({ stack, message }) {
    DEBUG ? LOG(stack) : console.error(message)
    process.exit(1)
  }
})()
