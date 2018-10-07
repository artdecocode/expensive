let argufy = require('argufy'); if (argufy && argufy.__esModule) argufy = argufy.default;

const getArgs = () => {
  return argufy({
    domains: { command: true, multiple: true },
    version: { short: 'v', boolean: true },
    help: { short: 'h', boolean: true },
    init: { short: 'I', boolean: true },
    info: { short: 'i', boolean: true },
    // <INFO>
    sort: 'S', // add validation to argufy
    desc: { short: 'D', boolean: true },
    filter: { short: 'F' },
    pageSize: { short: 'P' },
    type: 'T', // add description to argufy, so that usage can be passed to usually
    // </INFO>
    register: { short: 'r', boolean: true },
    free: { short: 'f', boolean: true },
    zones: 'z',
    Whois: { boolean: true },
    whois: { short: 'w', boolean: true },
    whitelistIP: { short: 'W', boolean: true },
    sandbox: { short: 's', boolean: true },
    coupon: { boolean: true },
    promo: { short: 'p' },
  })
}

module.exports=getArgs