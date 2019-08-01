import africa from 'africa'
import { debuglog } from 'util'
import questions from '../questions'
import { getAppName } from './'

const LOG = debuglog('expensive')

/**
 * An authentication function that will read the `~/.expensiverc` or `~/.expensive-standboxrc` file.
 * @param {boolean} sandbox Whether to use the sandbox rc.
 */
const getConfig = async (sandbox) => {
  const p = getAppName(sandbox)
  LOG('Reading %s rc', p)
  const {
    ApiUser,
    ApiKey,
    ClientIp,
    phone,
  } = /** @type {_expensive.Settings} */ (await africa(p, questions))
  if (!ApiUser) throw new Error('Api User is missing')
  if (!ApiKey) throw new Error('Api Key is missing')
  return { ApiUser, ApiKey, ClientIp, phone }
}

export default getConfig

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../../types').Settings} _expensive.Settings
 */