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
    },
    description: 'A CLI application to access namecheap.com via API.',
    line: 'expensive [command]',
  })
  return u
}
