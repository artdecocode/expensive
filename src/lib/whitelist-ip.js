import bosom from 'bosom'
import { homedir } from 'os'
import { join } from 'path'
import { debuglog } from 'util'
import { askSingle } from 'reloquent'
import NameCheapWeb from '@rqt/namecheap-web'
import { getAppName } from '.'

const LOG = debuglog('expensive')

/**
 * A handler to make sure that an IP address is allowed.
 * @param {Settings} settings
 */
const whitelistIP = async (settings, sandbox, ip) => {
  const IP = ip || await NameCheapWeb.LOOKUP_IP()
  const password = await askSingle({
    text: `Enter the password to white-list ${IP}`,
    validation(val) {
      if (!val) throw new Error('Please enter the password.')
    },
    password: true,
  })
  const nc = new NameCheapWeb({ sandbox })
  await nc.auth(settings.ApiUser, password, settings.phone)
  await nc.whitelistIP(IP)

  // Update the configuration to reflect the IP.
  // Todo: modify `africa` to be able to update the configuration.
  const n = getAppName(sandbox)
  const rcPath = join(homedir(), `.${n}rc`)
  LOG('Writing to %s', rcPath)
  await bosom(rcPath, {
    ...settings,
    ClientIp: IP,
  })
}

export default whitelistIP

/**
 * @typedef {import('../lib/get-config').Settings} Settings
 */