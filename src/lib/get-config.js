import africa from 'africa'
import { debuglog } from 'util'
import questions from '../questions'

const LOG = debuglog('expensive')

/**
 * @typedef {Object} AfricaOpts
 * @property {function} [rcNameFunction] a function which returns the name of the rc file to store data in, e.g., packageName => `.${packageName}rc`,
 * @property {string} [homedir] where to store the rc file.
 * @property {boolean} [force=false] force asking questions again to update the config
 *
 *
 * An authentication function which will read the package's rc file, or the global expensive rc file.
 * @typedef {Object} AuthConfig
 * @property {string} [packageName] name of the package which implements the expensive API. The `.packagename-expensive.rc` file will be created in the home directory.
 * @property {boolean} [global=false] Whether to use the global expensive config.
 * @property {AfricaOpts} [opts] A configuration to pass to africa.
 *
 * @param {AuthConfig} config
 * @returns {ReturnType} An object read from local rc file.
 */
const getConfig = async (config = {}) => {
  const {
    packageName, global = false, opts = {},
  } = config
  if (!global && !packageName) throw new Error('An implementing package name should be given if not using a global rc')
  const p = global && !packageName ? 'expensive' : `${packageName}-expensive`
  LOG('authenticating %s', p)
  const {
    ApiUser,
    ApiKey,
    ClientIp,
    AWS_id,
    AWS_key,
  } = await africa(p, questions, opts)
  return { ApiUser, ApiKey, ClientIp, AWS_id, AWS_key }
}

export default getConfig

/**
 * @typedef {Object} ReturnType
 * @property {string} ApiUser namecheap user
 * @property {string} ApiKey namecheap api key
 * @property {string} ClientIp client ip
 * @property {string} AWS_id aws key id
 * @property {string} AWS_key aws access key
 */
