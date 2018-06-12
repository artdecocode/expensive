import authenticate from '.'
import { launch } from 'chrome-launcher'
import { askSingle } from 'reloquent'

const handleRequestIP = async (message, { phone, user, headless }) => {
  const _ip = /Invalid request IP: (.+)/.exec(message)
  if (!_ip) throw new Error('Could not extract IP from the error message')
  const [, ip] = _ip
  const [password, chrome] = await Promise.all([
    askSingle({
      text: `Enter password to white-list ${ip}`,
    }),
    launch({
      startingUrl: 'https://www.namecheap.com/myaccount/login.aspx',
      chromeFlags: [
        ...(headless ? ['--headless'] : []),
        // userDataDir,
        // '--headless', '--disable-gpu', '--window-size=1000,2000'
      ],
    }),
  ])

  const res = await authenticate({
    user,
    password,
    ip,
    phone,
    chrome,
    headless,
  })
  return res
}

export default handleRequestIP
