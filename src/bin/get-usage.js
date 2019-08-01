import usually from 'usually'
import { reduceUsage } from 'argufy'
import { c } from 'erte'
import { argsConfig, argsConfigCheck, argsConfigRegister, argsConfigInfo } from './get-args'
import { allZones } from '../lib'

const l = allZones.join(', ')

export default () => {
  const def = usually({
    usage: reduceUsage(argsConfig),
    description: c('expensive', 'yellow') + `
A CLI application to access namecheap.com domain name registrar API.`,
  })
  const info = usually({
    usage: {},
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

  return u
}
