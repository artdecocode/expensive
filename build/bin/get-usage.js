const usually = require('usually');
const { reduceUsage } = require('argufy');
const { c } = require('erte');
const { argsConfig, argsConfigCheck, argsConfigRegister, argsConfigInfo } = require('./get-args');
const { allZones } = require('../lib');

const l = allZones.join(', ')

module.exports=() => {
  const def = usually({
    usage: reduceUsage(argsConfig),
    description: c('expensive', 'yellow') + `
A CLI application to access namecheap.com domain name registrar API.`,
  })
  const info = usually({
    description: c('expensive domain.com --info', 'magenta') + `
Display the information about the domain on the account.
Also displays DNS hosts if using Namecheap's DNS.`,
  }).trim() + '\n'
  const list = usually({
    description: c('expensive', 'red') + `
Print the list of domains belonging to the account.`,
    usage: reduceUsage(argsConfigInfo),
  })
  const reg = usually({
    description: c('expensive domain.com -r [-p PROMO]', 'green') + `
Register the domain name. Expensive will attempt to find the promo
code online, and compare its price to the normal price.`,
    usage: reduceUsage(argsConfigRegister),
  })
  const check = usually({
    description: c('expensive domain|domain.com [domain.org] [-f] [-z app,page]', 'blue') + `
Check domains for availability. When no TLD is given,
${l} are checked.`,
    usage: reduceUsage(argsConfigCheck),
  })
  const u = [def, info, list, reg, check].join('\n')
//   const u = usually({
//     usage: {
//       '<empty>': 'Display the list of domains on account.',
//       '| -f, --free': 'Display only free domains when checking.',
//       '| -z, --zones': 'Check in these zones only.',
//       '| [co,io,...]': '',
//       'domain[.co]': `Check a domain name for availability,
// or use the domain as input for commands bellow.
// Checks the following zones when no TLD is given:
// ${l}.`,
//       // 'domain.co': 'Check this domain name for availability.',

//       '-i, --info': 'Display info on the domain.',
//       '| -S, --sort': 'Sort by this field (name, expire, create).',
//       '| -D, --desc': 'Sort in descending order.',
//       '| -F, --filter': 'Filter by this word.',
//       '| -P, --pageSize': 'The page size.',
//       '| -T, --type': 'Domain type (ALL, EXPIRING, EXPIRED).',
//       '-r, --register': 'Register the domain.',
//       '| -p, --promo': 'Use this promo code on registration.',
//       '-w, --whois': 'Display brief WHOIS data.',
//       '--Whois': 'Display full WHOIS data.',
//       // '-r53, --route53': 'assign a hosted zone',
//       '-I, --init': 'Interactively initialise the configuration.',
//       '-h, --help': 'Print usage information.',
//       '-v, --version': 'Print package\'s version.',
//       '-s, --sandbox': 'Use the sandbox API.',
//       '--coupon': 'Find this month\'s coupon.',
//     },
//     line: 'expensive [domain [domain.co]]\n  [--info[ -fz]|register[ -p]|whois|Whois]\n  [-SDFPT] [-Ihv]',
//   })
  return u
}
