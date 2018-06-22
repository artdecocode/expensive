/* eslint-disable no-console */
// import { debuglog } from 'util'
import { equal, ok } from 'assert'
import { askSingle } from 'reloquent'
import { extractFormState, extractOptions, askForNumber } from './lib'
// import promto from 'promto'
import { Session } from 'rqt'

// const LOG = debuglog('expensive')

const S = !!process.env.SANDBOX
console.log('sandbox: %s', S)

const getHost = () => {
  return `https://www.${S ? 'sandbox.' : ''}namecheap.com`
}
const getApHost = () => {
  return `https://ap.www.${S ? 'sandbox.' : ''}namecheap.com`
}

const getWhitelistUrl = () => {
  const host = getApHost()
  const u = `${host}/settings/tools/apiaccess/whitelisted-ips`
  return u
}

const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36'

const authenticate = async ({
  user,
  password,
  ip,
  phone,
}) => {
  const returnUrl = getWhitelistUrl()
  const host = getHost()
  const appHost = getApHost()
  const url = `${host}/myaccount/login-signup.aspx?ReturnUrl=${encodeURIComponent(returnUrl)}`

  const session = new Session({
    headers: {
      'User-Agent': USER_AGENT,
    },
  })
  const { SessionKey } = await session.request(`${host}/cart/ajax/SessionHandler.ashx`)

  const { body, headers } = await session.request(url, {
    data: {
      hidden_LoginPassword: '',
      LoginUserName: user,
      LoginPassword: password,
      sessionEncryptValue: SessionKey,
    },
    type: 'form',
    returnHeaders: true,
  })

  const validationErrorRe = /<strong class="title">Validation Error<\/strong>\s+<div>(.+?)<\/div>/
  const [, err] = validationErrorRe.exec(body) || []
  if (err) throw new Error(err.replace(/(<([^>]+)>)/ig, ''))

  if (headers.location.startsWith('/myaccount/twofa/secondauth.aspx')) {
    const loc = await secondAuth(`${host}${headers.location}`, session, phone)
    equal(loc, returnUrl, `Expected to have been redirected to ${returnUrl}`)
  }
  const body2 = await session.request(returnUrl)
  const token = extractXsrf(body2)

  const name = `expensive ${new Date().toLocaleString()}`.replace(/:/g, '-')
  const res = await session.request(`${appHost}/api/v1/ncpl/apiaccess/ui/AddIpAddress`, {
    data: {
      name,
      accountPassword: password,
      ipAddress: ip,
    },
    headers: {
      'x-ncpl-rcsrf': token,
    },
  })
  if (!res.Success) throw new Error(res.Errors.map(({ Message }) => Message).join(', '))
}

const extractXsrf = (body) => {
  const re = /<input type="hidden" id="x-ncpl-csrfvalue" value="(.+?)"/
  const res = re.exec(body)
  if (!res) throw new Error('Could not find the x-ncpl-csrfvalue token on the page.')
  const [, token] = res
  return token
}

const secondAuth = async (location, session, phone) => {
  let fs
  let data

  const body = await session.request(location)

  ok(/Select Phone Contact Number/.test(body), 'Could not find the Select Phone section.')

  const options = extractOptions(body)
  ok(options.length, 'Could not find any numbers.')

  const value = await askForNumber(options, phone)

  fs = extractFormState(body)
  data = {
    ...fs,
    ctl00$ctl00$ctl00$ctl00$base_content$web_base_content$home_content$page_content_left$CntrlAuthorization$ddlAuthorizeList: value,
    ctl00$ctl00$ctl00$ctl00$base_content$web_base_content$home_content$page_content_left$CntrlAuthorization$btnSendVerification: 'Proceed with Login',
  }
  const body2 = await session.request(location, {
    data,
    type: 'form',
  })

  if (/You have reached the limit on the number.+/m.test(body2)) {
    throw new Error(body2.match(/You have reached the limit on the number.+/m)[0])
  }
  ok(/We sent a message with the verification code/.test(body2), 'Could not find the code entry section.')

  const loc = await submitCode(body2, session, location)
  return loc
}

const submitCode = async (body, session, location) => {
  const [, b] = /Your 6-digit code begins with (\d)./.exec(body) || []
  if (!b) throw new Error('Could not send the code.')

  const code = await askSingle({
    text: `Security code (begins with ${b})`,
  })
  const fs = extractFormState(body)
  const data = {
    ...fs,
    ctl00$ctl00$ctl00$ctl00$base_content$web_base_content$home_content$page_content_left$CntrlAuthorization$txtAuthVerification: code,
    ctl00$ctl00$ctl00$ctl00$base_content$web_base_content$home_content$page_content_left$CntrlAuthorization$btnVerify: 'Submit Security Code',
  }

  const { body: body2, headers } = await session.request(location, {
    data,
    type: 'form',
    returnHeaders: true,
  })
  if (/Oops, you entered an invalid code.+/m.test(body2)) {
    console.log('Incorrect code.')
    const res = await submitCode(body2, session, location)
    return res
  }
  ok(/Object moved/.test(body2), 'Expected to be redirected after sign-in.')
  return headers.location
}

export default authenticate
