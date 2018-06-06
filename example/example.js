import { auth, checkDomains } from '../src'

const [,,,domain = 'google.com'] = process.argv

;(async () => {
  // ip?
  const a = await auth() // { ApiKey, UserName, ClientIp }
  const res = await checkDomains({
    ...a,
    domain,
  })
  console.log(res)
})()
