/* eslint-disable no-console */
import { debuglog } from 'util'
import { equal } from 'assert'
import { launch } from 'chrome-launcher'
import CDP from 'chrome-remote-interface'
import Chrome from 'chrome-remote-interface/lib/chrome' // eslint-disable-line no-unused-vars
import { writeFileSync } from 'fs'
import { parse } from 'url'
import { askSingle } from 'reloquent'
import { c } from 'erte'
// import promto from 'promto'

const LOG = debuglog('expensive')

const blockedExtensions = [
  'css',
  'png',
  'svg',
  'woff',
  'ttf',
  'GetCartTotalAndItemCount',
  'Domains/.+',
  'ExpiringSoon/.+',
  // 'SiteServices/.+',
]
const s = blockedExtensions.join('|')
const re = new RegExp(`(${s})$`)

// const blockedHosts = [
//   'google-analytics.com',
//   'collector.githubapp.com',
//   'facebook.com',
//   'pxf.io',
//   'twitter.com',
//   'bing.com',
//   'ads-twitter.com',
//   'answerdash.com',
//   'googleadservices.com',
//   'doubleclick.net',
//   'facebook.net',
//   'impactradius-event.com',
//   'dnn506yrbagrg.cloudfront.net',
//   'googletagmanager.com',
// ]
// const whiteListedHosts

// const t = blockedHosts.map(h => {
//   return h.replace(/\./g, '\\.')
// }).join('|')
// const reb = new RegExp(`(${t})$`)
// LOG(reb)

const isBlocked = (url) => {
  const { pathname, host } = parse(url)
  const pb = pathname.match(re)
  if (pb) return true
  return !host.endsWith('namecheap.com')
  // const hb = host.match(reb)
  // return !!hb
}

const numberRe = /(.+?)(\d\d\d)$/

const authenticate = async ({
  user,
  password,
  ip, // ip to set
  phone,
}) => {
  const chrome = await launch({
    // userDataDir,
    startingUrl: 'about:blank',
    chromeFlags: [
      // '--headless', '--disable-gpu', '--window-size=1000,2000'
    ],
  })
  const { port } = chrome
  LOG('Chrome debugging port running on %s', port)

  /** @type {Chrome} */
  let client
  try {
    client = await CDP({
      port,
    })
    const { Network, Page, DOM, Runtime, Input } = client

    Network.requestIntercepted(({ interceptionId, request }) => {
      const blocked = isBlocked(request.url)
      if (!blocked) {
        console.log(request.url)
      }
      Network.continueInterceptedRequest({
        interceptionId,
        errorReason: blocked ? 'Aborted' : undefined,
      })
    })
    // enable events then start!
    await Network.enable()
    await Page.enable()
    await DOM.enable()
    await Runtime.enable()

    await Network.setRequestInterception({ patterns: [{ urlPattern: '*' }] })
    await Network.setCacheDisabled({ cacheDisabled: true })

    await Page.navigate({ url: 'https://www.namecheap.com/myaccount/login.aspx' })
    await Page.loadEventFired()

    await login(Runtime, { user, password })
    await Page.loadEventFired()

    await selectPhone(Runtime, phone)
    await Page.loadEventFired()

    await enterCode(Runtime)
    await Page.loadEventFired()

    await Page.navigate({ url: 'https://ap.www.namecheap.com/settings/tools/apiaccess/whitelisted-ips' })
    await Page.loadEventFired()

    await addIpAddress(Runtime, Input, { ip, password })

    const { data } = await Page.captureScreenshot()
    writeFileSync('screenshot.png', Buffer.from(data, 'base64'))
  } catch (err) {
    LOG(err)
  } finally {
    if (client) {
      await client.close()
    }
  }

  await chrome.kill()
  console.log('Chrome killed')
}

// const res = await evaluate(Runtime, `
//       (() => {
//         try {
//           var el = document.querySelector('.gb-alerts-sticky').children[0]
//           var re = new RegExp(el.innerHTML)
//           return re.test('added successfully')
//         } catch (err) {
//           return false
//         }
//       })()
//     `)
//     ok(res, 'Could not find the success notification alert')

const addIpAddress = async (Runtime, Input, { ip, password }) => {
  const name = `Expensive on ${new Date().toLocaleString()}`.replace(/:/g, '-')
  await click(Runtime, 'button')
  await new Promise(r => setTimeout(r, 1000)) // wait for
  await focus(Runtime, '#ip-name')
  for (let i = 0; i < name.length; i++) {
    await Input.dispatchKeyEvent({ type: 'char', text: name[i] })
  }
  await focus(Runtime, '#ip-address')
  for (let i = 0; i < ip.length; i++) {
    await Input.dispatchKeyEvent({ type: 'char', text: ip[i] })
  }
  await evaluate(Runtime, 'document.querySelectorAll(\'input[type="password"]\')[1].focus()')
  for (let i = 0; i < password.length; i++) {
    await Input.dispatchKeyEvent({ type: 'char', text: password[i] })
  }
  await evaluate(Runtime, 'document.querySelectorAll(\'button.gb-btn--primary\')[1].click()')
}

const login = async (Runtime, { user, password }) => {
  await Runtime.evaluate({
    expression: `document.querySelector("input.nc_username").value = "${user}"`,
  })
  await Runtime.evaluate({
    expression: `document.querySelector("input.nc_password").value = "${password}"`,
  })
  await Runtime.evaluate({
    expression: 'document.querySelector("input.nc_login_submit").click()',
  })
}

const evaluate = async (Runtime, expression, json) => {
  let e = expression
  if (json) {
    e = `
    (() => {
      var a = ${expression}
      var j = JSON.stringify(a)
      return j
    })()`
  }
  const { result, exceptionDetails } = await Runtime.evaluate({
    expression: e,
  })
  if (exceptionDetails) {
    throw new Error(exceptionDetails.exception.description)
  }
  return json ? JSON.parse(result.value) : result.value
}

const selectPhone = async (Runtime, phone) => {
  const submitSelector = 'input[type="submit"]'
  const selectSelector = 'select.verification-method'
  /** @type {{v: string, i: string}[]} */
  const options = await evaluate(Runtime, `
  Array.from(document.querySelectorAll('${selectSelector} > option'))
    .map(p => ({v: p.value, i: p.innerHTML }))`, true)

  if (phone) {
    const option = options.find(({ i }) => i.endsWith(phone))
    if (!option) throw new Error(`A phone number ending with ${phone} cannot be found. Added numbers: ${options.map(({ i }) => i).join(', ')}`)
    await evaluate(Runtime, `document.querySelector('${selectSelector}').value = "${option.v}"`)
    await evaluate(Runtime, `document.querySelector('${submitSelector}').click()`)
    return
  }

  const keys = options.map(({ i }) => i.slice(i.length - 3))

  if (options.length) {
    const text = `Which phone number to use for 2 factor auth
${
  options
    .map(({ i }) => ` ${i}`)
    .map(o => {
      const r = numberRe.exec(o)
      if (!r) return o
      const [, g, n] = r
      const gr = c(g, 'grey')
      const co = `${gr}${n}`
      return co
    })
    .join('\n')
}
enter last 3 digits`

    const answer = await askSingle({
      text,
      async getDefault() {
        return phone || keys[0]
      },
      validation(a) {
        const p = options.some(({ i }) => i.endsWith(a))
        if (!p) {
          throw new Error('unknown number entered')
        }
      },
    })

    console.log(answer)
    const { v } = options.find(({ i }) => i.endsWith(answer))
    await Runtime.evaluate({
      expression: `document.querySelector('select.verification-method').value = "${v}"`,
    })
  }
  await Runtime.evaluate({
    expression: `document.querySelector('input[type="submit"]').click()`, // eslint-disable-line
  })
}

// const awaitSelector = (selector, interval = 100, timeout = 2000) => `
//   new Promise((resolve, reject) => {
//     var ms = ${interval}
//     var i = 0
//     var t = setInterval(() => {
//       i += ms
//       if (i > ${timeout}) {
//         clearTimeout(t)
//         return reject(new Error('Timeout of ${timeout}ms reached'))
//       }
//       var el = document.querySelector('${selector}')
//       if (el) {
//         clearTimeout(t)
//         resolve(el)
//       }
//     }, ms)
//   })
// `

// const awaitElement = async (Runtime, selector) => {
//   const { exceptionDetails } = await Runtime.evaluate({
//     expression: awaitSelector(selector),
//     awaitPromise: true,
//   })
//   if (exceptionDetails) {
//     throw new Error(exceptionDetails.exception.description)
//   }
// }

const getValue = async (Runtime, selector) => {
  const expression = `document.querySelector('${selector}').value`
  const res = await evaluate(Runtime, expression)
  return res
}
const setValue = async (Runtime, selector, value) => {
  const expression = `document.querySelector('${selector}').value = "${value}"`
  await evaluate(Runtime, expression)
}
const click = async (Runtime, selector) => {
  const expression = `document.querySelector('${selector}').click()`
  const res = await evaluate(Runtime, expression)
  return res
}
const focus = async (Runtime, selector) => {
  const expression = `document.querySelector('${selector}').focus()`
  const res = await evaluate(Runtime, expression)
  return res
}

const enterCode = async (Runtime) => {
  const val = await getValue(Runtime, 'input[type="submit"]')
  equal(val, 'Submit Security Code', 'Did not get to the page with verification of security code')

  /** @type {string} */
  const info = await Runtime.evaluate({
    expression: `document.querySelector('.info').innerText`, // eslint-disable-line
  })
  const r = /Your \d-digit code begins with (\d)/.exec(info.result.value)
  if (!r) {
    throw new Error('Could not enter the code') // return
  }

  const [, b] = r

  const code = await askSingle({
    text: `Security code (begins with ${b})`,
  })

  await setValue(Runtime, 'input[placeholder="Verification Code"]', code)
  await click(Runtime, 'input[type="submit"]')
}

export default authenticate
