import { makeTestSuite } from 'zoroaster'
import Context from '../context'

const { BIN } = Context

const strip = (stdout) => {
  return stdout
    .replace(re, '')
    .split('\n').map(l => l.trimRight()).join('\n')
    .trim()
}

const check = makeTestSuite('test/result/fork/check.md', {
  fork: {
    module: BIN,
    options: {
      env: {
        SANDBOX: 1,
      },
    },
  },
  mapActual: ({ stdout }) => strip(stdout),
})

const register = makeTestSuite('test/result/fork/register.md', {
  fork: {
    module: BIN,
    options: {
      env: {
        SANDBOX: 1,
      },
    },
    /**
     * @param {string[]}
     * @param {Context}
     */
    getArgs([zone], { domain }) {
      return [`${domain}.${zone}`, '-r']
    },
    inputs: [
      [/Apply coupon/, 'n'], // coupons not supported on sandbox
      [/OK/, 'y'],
    ],
    log: true,
  },
  mapActual({ stdout }) {
    const s = strip(stdout)
      .replace(/Registering .+/, 'Registering DOMAIN')
      .replace(/Successfully registered [\w-\d.]+/, 'Successfully registered DOMAIN')
    return s
  },
  context: Context,
})

// MIT (c) https://github.com/ivoputzer/m.noansi
const re = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-PRZcf-nqry=><]/g // eslint-disable-line

export { check, register }