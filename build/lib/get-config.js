let africa = require('africa'); if (africa && africa.__esModule) africa = africa.default;
const { debuglog } = require('util');
const questions = require('../questions');
const { getAppName } = require('.');

const LOG = debuglog('expensive')

/**
 * An authentication function that will read the `~/.expensiverc` or `~/.expensive-standboxrc` file.
 * @param {sandbox} sandbox Whether to use the sandbox rc.
 * @returns {Settings} An object read from local rc file.
 */
const getConfig = async (sandbox) => {
  const p = getAppName(sandbox)
  LOG('Reading %s rc', p)
  const {
    ApiUser,
    ApiKey,
    ClientIp,
    phone,
  } = await africa(p, questions)
  if (!ApiUser) throw new Error('Api User is missing')
  if (!ApiKey) throw new Error('Api Key is missing')
  return { ApiUser, ApiKey, ClientIp, phone }
}

module.exports=getConfig

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
