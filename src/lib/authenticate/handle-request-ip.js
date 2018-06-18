import authenticate from '.'
import { launch } from 'chrome-launcher'
import { askSingle } from 'reloquent'

const handleRequestIP = async (message, { phone, user, head }) => {
  const _ip = /Invalid request IP: (.+)/.exec(message)
  if (!_ip) throw new Error('Could not extract IP from the error message')
  const [, ip] = _ip
  const [password, chrome] = await Promise.all([
    askSingle({
      text: `Enter password to white-list ${ip}`,
    }),
    launch({
      chromeFlags: [
        ...(head ? [] : ['--headless'/*, '--window-size=1000,2000'*/]),
        // userDataDir,
        // '--headless', '--disable-gpu',
      ],
    }),
  ])

  const res = await authenticate({
    user,
    password,
    ip,
    phone,
    chrome,
  })
  return res
}

export default handleRequestIP
