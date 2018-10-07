import { makeTestSuite } from 'zoroaster'
import Context from '../context'

const { BIN } = Context

const strip = (stdout) => {
  return stdout
    .replace(re, '')
    .split('\n').map(l => l.trimRight()).join('\n')
    .trim()
}

const fork = {
  module: BIN,
  options: {
    env: {
      SANDBOX: 1,
    },
  },
}

const ts = makeTestSuite('test/result/fork/default.md', {
  fork,
  mapActual: ({ stdout }) => strip(stdout),
})

const register = makeTestSuite('test/result/fork/register.md', {
  fork: {
    ...fork,
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

const cancelRegister = makeTestSuite('test/result/fork/cancel-register.md', {
  fork : {
    ...fork,
    /**
     * @param {string[]}
     * @param {Context}
     */
    getArgs([zone], { domain }) {
      return [`${domain}.${zone}`, '-r']
    },
    inputs: [
      [/OK/, 'n'],
    ],
    log: true,
  },
  mapActual({ stdout }) {
    const s = strip(stdout)
      .replace(/Registering .+/, 'Registering DOMAIN')
    return s
  },
  context: Context,
})

const re = /\033\[.*?m/g

export { register, cancelRegister }
export default ts