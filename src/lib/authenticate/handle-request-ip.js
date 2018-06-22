import { askSingle } from 'reloquent'
import authenticate from '.'

const handleRequestIP = async (message, { phone, user }) => {
  const _ip = /Invalid request IP: (.+)/.exec(message)
  if (!_ip) throw new Error('Could not extract IP from the error message')
  const [, ip] = _ip
  const password = await askSingle({
    text: `Enter password to white-list ${ip}`,
  })

  try {
    await authenticate({
      user,
      password,
      ip,
      phone,
    })
    return true
  } catch ({ message: m, stack }) {
    console.log(stack)
    return m
  }
}

export default handleRequestIP
