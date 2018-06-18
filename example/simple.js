import Namecheap, { getConfig } from '../src'

(async () => {
  try {
    // use `.expensive-example.rc` file
    // pass `global` to read `.expensiverc` instead
    const Auth = await getConfig({ packageName: 'example' })

    const nc = new Namecheap(Auth)
    const check = await nc.domains.check({
      domains: ['testt.co', 'testt.cc'],
    })
    console.log(check)
  } catch ({ stack, message }) {
    DEBUG ? LOG(stack) : console.error(message)
    process.exit(1)
  }
})()
