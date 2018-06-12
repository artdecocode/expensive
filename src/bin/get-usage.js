import usually from 'usually'
import { startupyDomains } from '../lib'

const l = startupyDomains.join(', ')

export default () => {
  const u = usually({
    usage: {
      domain: `check a domain name in various tech zones\n(${l})`,
      'domain.com': 'check a domain name',
      '-i, --info': 'display info on domain',
      '-r, --register': 'register a domain',
      '-r53, --route53': 'assign a hosted zone',
      '-I, --init': 'interactively initialise the configuration',
      '-h, --help': 'print usage information',
      '-v, --version': 'print package\'s version',
      '-H, --head': 'don\'t use headless Chrome for auth',
    },
    description: 'A CLI application to access namecheap.com domain name registrar API.\nSee man expensive for more information.',
    line: 'expensive [domain.co] -irIHhv -r53',
  })
  return u
}
