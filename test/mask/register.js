import makeTestSuite from '@zoroaster/mask'
import Context from '../context'

const ts = makeTestSuite('test/result/fork/register', {
  fork: {
    module: Context.BIN,
    options: Context.OPTIONS,
    // log: true,
    /**
     * @param {string[]}
     * @param {Context}
     */
    getArgs([zone], { domain }) {
      return [`${domain}.${zone}`, '-r']
    },
    preprocess: {
      stdout(stdout) {
        const s = stdout
          .replace(/Registering [^ ]+/, 'Registering DOMAIN')
          .replace(/Successfully registered [\w-\d.]+/, 'Successfully registered DOMAIN')
        return Context.trimRight(s)
      },
    },
    log: true,
  },
  context: Context,
})

export default ts