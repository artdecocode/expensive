import africa from 'africa'
import { debuglog } from 'util'
import questions from '../questions'

const LOG = debuglog('expensive')

/**
 * An authentication function that will read the `~/.expensiverc` or `~/.expensive-standboxrc` file.
 * @returns {Settings} An object read from local rc file.
 */
const getConfig = async (sandbox) => {
  const p = sandbox ? 'expensive-sandbox' : 'expensive'
  LOG('Reading %s rc', p)
  const {
    ApiUser,
    ApiKey,
    ClientIp,
    phone,
  } = await africa(p, questions)
  return { ApiUser, ApiKey, ClientIp, phone }
}

export default getConfig

/**
 * @typedef {Object} Settings
 * @property {string} ApiUser namecheap user
 * @property {string} ApiKey namecheap api key
 * @property {string} ClientIp client ip
 * @property {string} phone Last 3 digits of the phone number.
 */



/**
 * @typedef {Object} AfricaOpts
 * @property {function} [rcNameFunction] a function which returns the name of the rc file to store data in, e.g., packageName => `.${packageName}rc`,
 * @property {string} [homedir] where to store the rc file.
 * @property {boolean} [force=false] force asking questions again to update the config
 *
 */
