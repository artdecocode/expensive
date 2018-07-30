import rqt from 'rqt'
import { debuglog } from 'util'

const LOG = debuglog('expensive')
const handleWhitelist = async (whitelistIp) => {
  if (whitelistIp) {
    const err = new Error()
    err.props = {
      Number: 1,
    }
    LOG('waiting for ip...')
    const ip = await rqt('https://api.ipify.org')
    err.message = `Fake Invalid request IP: ${ip}`
    throw err
  }
}

export default handleWhitelist
