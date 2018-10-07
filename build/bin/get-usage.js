let usually = require('usually'); if (usually && usually.__esModule) usually = usually.default;
const { allZones } = require('../lib');

const l = allZones.join(', ')

module.exports=() => {
  const u = usually({
    usage: {
      domain: `check a domain name in a number of zones\n(${l})`,
      'domain.co': 'check a domain name',
      '-f': 'display only free domains when checking',
      '-z co,io': 'check in these zones only',
      '-i, --info': 'display info on domain',
      '-r, --register': 'register a domain',
      // '-r53, --route53': 'assign a hosted zone',
      '-I, --init': 'interactively initialise the configuration',
      '-h, --help': 'print usage information',
      '-v, --version': 'print package\'s version',
    },
    description: 'A CLI application to access namecheap.com domain name registrar API.\nSee man expensive for more information.',
    line: 'expensive [domain.co [domain.cc]] -f -z co[,io,app] -i -IHhv',
  })
  return u
}
