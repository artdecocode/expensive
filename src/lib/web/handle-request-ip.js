import { askSingle } from 'reloquent'
import bosom from 'bosom'
import { debuglog } from 'util'

const LOG = debuglog('expensive')

/**
 * Start white-listing of the IP address.
 * @param {string} message An error message containing the request IP.
 * @param {{ appName: string, phone: string, user: string }} config Arguments in an object.
 */
const handleRequestIP = async (message, config) => {
  const { appName, phone, user } = config

  const _ip = /Invalid request IP: (.+)/.exec(message)
  if (!_ip) throw new Error('Could not extract IP from the error message.')

  const [, ip] = _ip
  let p
  try {
    p = await bosom(`.${appName}-password`)
  } catch (err) {
    LOG('%s password file not found', appName)
  }
  const password = p || await askSingle({
    text: `Enter password to white-list ${ip}`,
  })

  await authenticate({
    user,
    password,
    ip,
    phone,
  })
}

export default handleRequestIP
