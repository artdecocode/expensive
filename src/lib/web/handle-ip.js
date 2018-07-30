import bosom from 'bosom'
import { homedir } from 'os'
import { resolve } from 'path'
import { debuglog } from 'util'
import handleRequestIP from './handle-request-ip'

const LOG = debuglog('expensive')

/**
 * A handler to make sure that an IP address is allowed.
 * @param {{ message: string, phone: string, user: string, name: string, props: { Number: number }}} config
 */
const handleIp = async (config = {}) => {
  const {
    message,
    phone,
    user,
    name: appName,
    props: { Number },
  } = config

  if (![1011150, 1].includes(Number)) {
    return
  }

  const authComplete = await handleRequestIP(message, { appName, phone, user })
  if (authComplete === true) {
    // update the configuration to reflect the IP
    // modify `africa` to be able to update the configuration
    const rcPath = resolve(homedir(), `.${appName}rc`)
    LOG('writing to %s', rcPath)
    await bosom(rcPath)
    return true
  }
}

export default handleIp
