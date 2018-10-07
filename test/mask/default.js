import { makeTestSuite } from 'zoroaster'
import Context from '../context'
import NameCheap from '@rqt/namecheap'
import bosom from 'bosom'
import { homedir } from 'os'
import { join } from 'path'

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

// class InfoContext extends Context {
//   async _init() {
//     const p = join(homedir(), '.expensive-sandboxrc')
//     const { ApiUser, ApiKey, ClientIp } = await bosom(p)
//     const nc = new NameCheap({
//       sandbox: true,
//       user: ApiUser,
//       key: ApiKey,
//       ip: ClientIp,
//     })
//     const addresses = await nc.address.getList()
//     const { AddressId } = addresses.find(({ IsDefault }) => IsDefault)
//     const address = await nc.address.getInfo(AddressId)
//     this.fullDomain = `${this.domain}.com`
//     await nc.domains.create({
//       address,
//       domain: this.fullDomain,
//     })
//   }
// }

const check = makeTestSuite('test/result/fork/check.md', {
  fork,
  mapActual: ({ stdout }) => strip(stdout),
})

const info = makeTestSuite('test/result/fork/info.md', {
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

// const info = makeTestSuite('test/result/fork/info.md', {
//   fork : {
//     ...fork,
    /**
     * @param {string[]}
     * @param {InfoContext}
     */
    // getArgs([arg], { fullDomain }) {
    //   return [fullDomain, arg]
    // },
  // },
  // mapActual({ stdout, stderr }) {
  //   return strip(stdout)
  // },
  // context: InfoContext,
// })

// MIT (c) https://github.com/ivoputzer/m.noansi
const re = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-PRZcf-nqry=><]/g // eslint-disable-line

export { check, register, cancelRegister, info }