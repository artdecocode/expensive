import { ok } from 'assert'
import bosom from 'bosom'
import Session from 'rqt/build/session'
import { debuglog } from 'util'

const LOG = debuglog('expensive')

const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36'

const getHost = (S) => {
  return `https://www.${S ? 'sandbox.' : ''}namecheap.com`
}
const getApHost = (S) => {
  return `https://ap.www.${S ? 'sandbox.' : ''}namecheap.com`
}

const handleJsonRes = (res) => {
  if (res.__isError) {
    const err = new Error(res.Message)
    Object.assign(err, res)
    throw err
  }
  if (!res.Success) {
    const t = res.Errors.map(({ Message }) => Message).join(', ')
    const r = new Error(t)
    r.__type = res.__type
    throw r
  }
  return res
}

export default class Client {
  /**
   * Create a new web client.
   * @param {string} host
   * @param {Session} session
   * @param {string} password
   */
  constructor(user, password, sandbox = false) {
    this.host = getHost(sandbox)
    this.appHost = getApHost(sandbox)
    this._user = user
    this._password = password

    const session = new Session({
      headers: {
        'User-Agent': USER_AGENT,
      },
    })
    this._session = session
  }
  get user() {
    return this._user
  }
  makeUrl(page) {
    const u = this.makeAppHostUrl('api', 'v1', 'ncpl', 'apiaccess', 'ui', page)
    return u
  }
  makeSettingsUrl(...args) {
    const u = this.makeAppHostUrl('settings', ...args)
    return u
  }
  async obtainSession() {
    const u = this.makeHostUrl('cart', 'ajax', 'SessionHandler.ashx')
    const { SessionKey } = await this.request(u)
    ok(SessionKey, `Could not acquire the session key for ${u}.`)
    this.SessionKey = SessionKey
  }
  makeHostUrl(...args) {
    return `${this.host}/${args.join('/')}`
  }
  makeAppHostUrl(...args) {
    return `${this.appHost}/${args.join('/')}`
  }
  async signIn() {
    const r = encodeURIComponent(this.whitelistedIps)
    const u = this.makeHostUrl('myaccount', `login-signup.aspx?ReturnUrl=${r}`)
    const data = {
      hidden_LoginPassword: '',
      LoginUserName: this.user,
      LoginPassword: this._password,
      sessionEncryptValue: this.SessionKey,
    }
    await this.postRequest(u, { data, type: 'form' })
    if (this.headers.location == this.whitelistedIps) return
    if (/\/myaccount\/twofa\/secondauth\.aspx/.test(this.headers.location)) {
      const url = this.makeFullHostUrl(this.headers.location)
      await this.secondAuth(url)
    }

    // debugger
  }
  makeFullHostUrl(url) {
    return `${this.host}${url}`
  }
  async secondAuth(location) {
    let fs
    let data

    const body = await this.request(location)

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
  /**
   * @returns {Session} an instance of the session assigned on initialisation.
   */
  get session() {
    return this._session
  }
  async login() {

  }
  /**
   * @param {string} host THe host
   * @param {Session} session rqt session
   */
  async RemoveIpAddresses(names) {
    const page = 'RemoveIpAddresses'
    await this.postRequest(page, {
      names,
      accountPassword: this.password,
    })
    debugger
    // return body
  }
  /**
   *
   * @param {Result} res
   */

  async AddIpAddress() {
    const name = `expensive ${new Date().toLocaleString()}`.replace(/:/g, '-')
    const data = {
      name,
      accountPassword: password,
      ipAddress: ip,
    }
  }

  async GetIpAddresses() {

    // const res = await session.request(`${host}/settings/tools/apiaccess/whitelisted-ips`)
    return res
  }
  async saveSession(session) {
    await bosom(sessionFile, session.cookie)
  }
  async readSession(session) {
    const cookie = await bosom(sessionFile)
    session.cookie = cookie
  }
  async postRequest(url, { data, type, token }) {
    const { body, headers } = await this.session.request(url, {
      data,
      ...(token ? {
        headers: {
          'x-ncpl-rcsrf': token,
        },
      } : {}),
      ...(type ? { type } : {}),
      returnHeaders: true,
    })
    this.body = body
    this.headers = headers
    if (typeof this.body == 'object') {
      this.parsedBody = handleJsonRes(this.body) // parse
    }
    return { body, headers }
  }
  checkValidationError(body = this.body) {
    const validationErrorRe = /<strong class="title">Validation Error<\/strong>\s+<div>(.+?)<\/div>/
    const [, err] = validationErrorRe.exec(body) || []
    if (err) throw new Error(err.replace(/(<([^>]+)>)/ig, ''))
  }
  /**
   *
   * @param {*} to
   * @param {*} headers
   * @returns {string|false} Will return a redirect location
   */
  getRedirect(to, headers = this.headers) {
    const { location } = headers
    if (to instanceof RegExp && to.test(location)) {
      return location
    } else if (location == to) {
      return location
    }
    return false
    // else {
    //   t = new RegExp('^$')
    // }
    // if (headers.location.startsWith('/myaccount/twofa/secondauth.aspx')) {
    //   equal(loc, returnUrl, `Expected to have been redirected to ${returnUrl}`)
    // }
  }
  async request(url) {
    const { body, headers } = await this.session.request(url, {
      returnHeaders: true,
    })
    return body
    // try to extract token into this.token
  }
  get whitelistedIps() {
    return this.makeSettingsUrl('tools', 'apiaccess', 'whitelisted-ips')
  }

  // async whitelistedIps() {
  //   const u =
  //   const res = await this.request(u)
  //   return res
  // }
  // getReturnUrl(page) {
  //   return
  // }
}

const sessionFile = '.expensive-session.json'


/**
 * @typedef {Object} Result
 * @property {boolean} __isError
 * @property {string} Message
 * @property {{ Message: String }[]} Errors
 * @property {strings[]} Warnings
 * @property {boolean} Success
 */
