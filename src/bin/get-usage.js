import usually from 'usually'
import { startupyDomains } from '../lib'

const l = startupyDomains.join(', ')

export default () => {
  const u = usually({
    usage: {
      domain: `check a domain name in various tech zones\n(${l})`,
      'domain.com': 'check a domain name',
      '-h, --help': 'print usage information',
      '-v, --version': 'print package\'s version',
      '-I, --init': 'interactively initialise the configuration',
    },
    description: 'A CLI application to access namecheap.com domain name registrar API.\nSee man expensive for more information.',
    line: 'expensive -Ihv [domain.co]',
  })
  return u
}
