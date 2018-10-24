import { makeTestSuite } from 'zoroaster'
import Context from '../context'

const ts = makeTestSuite('test/result/fork/register.md', {
  fork: {
    module: Context.BIN,
    /** @param {Context} */
    options: Context.OPTIONS,
    // log: true,
    /**
     * @param {string[]}
     * @param {Context}
     */
    getArgs([zone], { domain }) {
      return [`${domain}.${zone}`, '-r']
    },
  },
  mapActual({ stdout }) {
    const st = Context.replaceR(stdout)
    const s = Context.strip(st)
      .replace(/Registering [^ ]+/, 'Registering DOMAIN')
      .replace(/Successfully registered [\w-\d.]+/, 'Successfully registered DOMAIN')
    return s
  },
  context: Context,
})

export default ts