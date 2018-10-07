import usually from 'usually'
import { allZones } from '../lib'

const l = allZones.join(', ')

export default () => {
  const u = usually({
    usage: {
      '<empty>': 'Display the list of domains on account.',
      '| -f, --free': 'Display only free domains when checking.',
      '| -z, --zones': 'Check in these zones only.',
      '| [co,io,...]': '',
      'domain[.co]': `Check a domain name for availability,
or use the domain as input for commands bellow.
Checks the following zones when no TLD is given:
${l}.`,
      // 'domain.co': 'Check this domain name for availability.',

      '-i, --info': 'Display info on the domain.',
      '| -S, --sort': 'Sort by this field (name, expire, create).',
      '| -D, --desc': 'Sort in descending order.',
      '| -F, --filter': 'Filter by this word.',
      '| -P, --pageSize': 'The page size.',
      '| -T, --type': 'Domain type (ALL, EXPIRING, EXPIRED).',
      '-r, --register': 'Register the domain.',
      '| -p, --promo': 'Use this promo code on registration.',
      '-w, --whois': 'Display brief WHOIS data.',
      '--Whois': 'Display full WHOIS data.',
      // '-r53, --route53': 'assign a hosted zone',
      '-I, --init': 'Interactively initialise the configuration.',
      '-h, --help': 'Print usage information.',
      '-v, --version': 'Print package\'s version.',
      '-s, --sandbox': 'Use the sandbox API.',
      '--coupon': 'Find this month\'s coupon.',
    },
    description: 'A CLI application to access namecheap.com domain name registrar API.',
    line: 'expensive [domain [domain.co]]\n  [--info[ -fz]|register[ -p]|whois|Whois]\n  [-SDFPT] [-Ihv]',
  })
  return u
}
