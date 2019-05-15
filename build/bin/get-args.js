let argufy = require('argufy'); if (argufy && argufy.__esModule) argufy = argufy.default;

       const argsConfig = {
  'domains': {
    description: 'The domain name for operations, or multiple domain names\nfor checking availability.',
    command: true,
    multiple: true,
  },
  'init': {
    description: 'Initialise package configuration interactively, i.e.,\nthe API key and ip address.',
    boolean: true,
    short: 'I',
  },
  'info': {
    description: 'Show the information for the domain.',
    boolean: true,
    short: 'i',
  },
  'register': {
    description: 'Register the domain.',
    boolean: true,
    short: 'r',
  },
  'whois': {
    description: 'Display brief WHOIS data.',
    boolean: true,
    short: 'w',
  },
  'Whois': {
    description: 'Display full WHOIS data.',
    boolean: true,
  },
  'coupon': {
    description: 'Find this month\'s coupon.',
    boolean: true,
  },
  'sandbox': {
    description: 'Use the sandbox API.',
    boolean: true,
    short: 's',
  },
  'whitelistIP': {
    description: 'Add current IP address to the list of white-listed ones.',
    boolean: true,
    short: 'W',
  },
  'version': {
    description: 'Display the current version number.',
    boolean: true,
    short: 'v',
  },
  'help': {
    description: 'Show help information.',
    boolean: true,
    short: 'h',
  },
}
const args = argufy(argsConfig)

/**
 * The domain name for operations, or multiple domain names
    for checking availability.
 */
       const _domains = /** @type {(!Array<string>|string)} */ (args['domains'])

/**
 * Initialise package configuration interactively, i.e.,
    the API key and ip address.
 */
       const _init = /** @type {boolean} */ (args['init'])

/**
 * Show the information for the domain.
 */
       const _info = /** @type {boolean} */ (args['info'])

/**
 * Register the domain.
 */
       const _register = /** @type {boolean} */ (args['register'])

/**
 * Display brief WHOIS data.
 */
       const _whois = /** @type {boolean} */ (args['whois'])

/**
 * Display full WHOIS data.
 */
       const _Whois = /** @type {boolean} */ (args['Whois'])

/**
 * Find this month's coupon.
 */
       const _coupon = /** @type {boolean} */ (args['coupon'])

/**
 * Use the sandbox API.
 */
       const _sandbox = /** @type {boolean} */ (args['sandbox'])

/**
 * Add current IP address to the list of white-listed ones.
 */
       const _whitelistIP = /** @type {boolean} */ (args['whitelistIP'])

/**
 * Display the current version number.
 */
       const _version = /** @type {boolean} */ (args['version'])

/**
 * Show help information.
 */
       const _help = /** @type {boolean} */ (args['help'])

       const argsConfigCheck = {
  'free': {
    description: 'Display only free domains.',
    boolean: true,
    short: 'f',
  },
  'zones': {
    description: 'Check in these zones only.',
    short: 'z',
  },
}
const argsCheck = argufy(argsConfigCheck, [process.argv[0], process.argv[1], ...args._argv])

/**
 * Display only free domains.
 */
       const _free = /** @type {boolean} */ (argsCheck['free'])

/**
 * Check in these zones only.
 */
       const _zones = /** @type {string} */ (argsCheck['zones'])

       const argsConfigInfo = {
  'sort': {
    description: 'Sort by this field (name, expire, create).',
    short: 'S',
  },
  'desc': {
    description: 'Sort in descending order.',
    boolean: true,
    short: 'D',
  },
  'filter': {
    description: 'Filter by this word.',
    short: 'F',
  },
  'pageSize': {
    description: 'The page size.',
    short: 'P',
  },
  'type': {
    description: 'Domain type (ALL, EXPIRING, EXPIRED).',
    short: 'T',
  },
}
const argsInfo = argufy(argsConfigInfo, [process.argv[0], process.argv[1], ...argsCheck._argv])

/**
 * Sort by this field (name, expire, create).
 */
       const _sort = /** @type {string} */ (argsInfo['sort'])

/**
 * Sort in descending order.
 */
       const _desc = /** @type {boolean} */ (argsInfo['desc'])

/**
 * Filter by this word.
 */
       const _filter = /** @type {string} */ (argsInfo['filter'])

/**
 * The page size.
 */
       const _pageSize = /** @type {string} */ (argsInfo['pageSize'])

/**
 * Domain type (ALL, EXPIRING, EXPIRED).
 */
       const _type = /** @type {string} */ (argsInfo['type'])

       const argsConfigRegister = {
  'promo': {
    description: 'Use this promo code on registration.',
    short: 'p',
  },
}
const argsRegister = argufy(argsConfigRegister, [process.argv[0], process.argv[1], ...argsInfo._argv])

/**
 * Use this promo code on registration.
 */
       const _promo = /** @type {string} */ (argsRegister['promo'])

/**
 * The additional arguments passed to the program.
 */
       const _argv = /** @type {!Array<string>} */ (argsRegister._argv)

module.exports.argsConfig = argsConfig
module.exports._domains = _domains
module.exports._init = _init
module.exports._info = _info
module.exports._register = _register
module.exports._whois = _whois
module.exports._Whois = _Whois
module.exports._coupon = _coupon
module.exports._sandbox = _sandbox
module.exports._whitelistIP = _whitelistIP
module.exports._version = _version
module.exports._help = _help
module.exports.argsConfigCheck = argsConfigCheck
module.exports._free = _free
module.exports._zones = _zones
module.exports.argsConfigInfo = argsConfigInfo
module.exports._sort = _sort
module.exports._desc = _desc
module.exports._filter = _filter
module.exports._pageSize = _pageSize
module.exports._type = _type
module.exports.argsConfigRegister = argsConfigRegister
module.exports._promo = _promo
module.exports._argv = _argv