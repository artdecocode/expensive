/* eslint-disable no-console */
import { debuglog } from 'util'
import { equal, ok } from 'assert'
import { askSingle } from 'reloquent'
import { extractFormState, extractOptions, askForNumber } from './lib'
import Client from '../web'

const LOG = debuglog('expensive')

const S = !!process.env.SANDBOX
LOG('sandbox: %s', S)


/**
 * Run authorisation process. Returns `true` if it passed an an ip address was added, and a string with an error message if there was an error.
 * @param {Config} config Config object
 * @param {string} config.user
 * @param {string} config.password
 * @param {string} config.ip
 * @param {string} config.phone
 */
const authenticate = async (config = {}) => {
  const {
    user,
    password,
    ip,
    phone,
  } = config

  const client = new Client(user, password, S)
  await client.obtainSession()
  await client.signIn()

  // const sauthLocation = client.getRedirect()

  client.checkValidationError()
  // const sauthLocation = client.getRedirect(/\/myaccount\/twofa\/secondauth\.aspx/)
  // if (sauthLocation) {
  //   const loc = await secondAuth(sauthLocation, client, phone)
  // }

  // const loc = await secondAuth(`${host}${headers.location}`, session, phone)

  // if (headers.location.startsWith('/myaccount/twofa/secondauth.aspx')) {
  //   equal(loc, returnUrl, `Expected to have been redirected to ${returnUrl}`)
  // }

  // client.
  const body2 = await session.request(returnUrl)
  const token = extractXsrf(body2)


  client.AddIpAddress()
  // await handleAppApi(appHost, session, data, 'AddIpAddress', token) // final step to add
}


// const handleAppApi = async (appHost, session, data, path, token) => {
//   const res = await session.request(`${appHost}${u}${path}`, {
//     data,
//     headers: {
//       'x-ncpl-rcsrf': token,
//     },
//   })
//   if (!res.Success) {
//     const t = res.Errors.map(({ Message }) => Message).join(', ')
//     const r = new Error(t)
//     r.__type = res.__type
//     throw r
//   }
// }

const extractXsrf = (body) => {
  const re = /<input type="hidden" id="x-ncpl-csrfvalue" value="(.+?)"/
  const res = re.exec(body)
  if (!res) throw new Error('Could not find the x-ncpl-csrfvalue token on the page.')
  const [, token] = res
  return token
}

/**
 *
 * @param {Client} client
 * @param {string} phone
 */
const secondAuth = async (location, client, phone) => {

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

/**
 * @typedef {Object} Config
 * @property {string} user
 * @property {string} password
 * @property {string} ip
 * @property {string} phone
 */
