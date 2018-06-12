import { parse } from 'url'
import { c } from 'erte'

// import promto from 'promto'

export const checkLimit = async (Runtime) => {
  const isLimitReached = await evaluate(Runtime, `
    (() => {
      try {
        var el = document.querySelector('.alert.error')
        var re = new RegExp('You have reached')
        return re.test(el.innerHTML)
      } catch (err) {
        return false
      }
    })()
  `)
  if (isLimitReached) throw new Error('You have reached the limit on the number of times you can request two-factor verification code through text message (SMS). You can request a code again only after 60 minutes.')
}

export const checkAuth = async (Runtime) => {
  const doesNotMatch = await evaluate(Runtime, `
    (() => {
      try {
        var el = document.querySelector('.loginForm .alert.error')
        var re = new RegExp('The password does not match')
        return re.test(el.innerHTML)
      } catch (err) {
        return false
      }
    })()
  `)
  if (doesNotMatch) throw new Error('The password does not match the user account or the account does not exist.')
}

export const evaluate = async (Runtime, expression, json) => {
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


export const getValue = async (Runtime, selector) => {
  const expression = `document.querySelector('${selector}').value`
  const res = await evaluate(Runtime, expression)
  return res
}
export const setValue = async (Runtime, selector, value) => {
  const expression = `document.querySelector('${selector}').value = "${value}"`
  await evaluate(Runtime, expression)
}
export const click = async (Runtime, selector) => {
  const expression = `document.querySelector('${selector}').click()`
  const res = await evaluate(Runtime, expression)
  return res
}
export const focus = async (Runtime, selector) => {
  const expression = `document.querySelector('${selector}').focus()`
  const res = await evaluate(Runtime, expression)
  return res
}


export const isBlocked = (url) => {
  const { pathname, host } = parse(url)
  const pb = pathname.match(re)
  if (pb) return true
  return !host.endsWith('namecheap.com')
  // const hb = host.match(reb)
  // return !!hb
}

const blockedExtensions = [
  'css',
  'png',
  'svg',
  'woff',
  'ttf',
  'assets/css',
  'cart',
  // 'GetCartTotalAndItemCount',
  // 'Domains/.+',
  // 'ExpiringSoon/.+',
  // 'SiteServices/.+',
]
const s = blockedExtensions.join('|')
const re = new RegExp(`(${s})$`)

export const numberRe = /(.+?)(\d\d\d)$/

export const mapPhoneOptions = o => {
  const r = numberRe.exec(o)
  if (!r) return o
  const [, g, n] = r
  const gr = c(g, 'grey')
  const co = `${gr}${n}`
  return co
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
