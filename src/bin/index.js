import { checkDomains, auth } from '..'
const [,,,domain = 'google.com'] = process.argv

;(async () => {
  const a = await auth({
    global: true,
  })
  const res = await checkDomains({
    ...a,
    domain,
  })
  console.log(res)
})()

