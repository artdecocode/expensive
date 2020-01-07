import argufy from 'argufy'

export const argsConfig = {
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

export const argsConfigCheck = {
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

export const argsConfigDns = {
  'record': {
    description: 'The record type. Can be one of the following:\n`A`, `AAAA`, `ALIAS`, `CAA`, `CNAME`, `MX`, `MXE`,\n`NS`, `TXT`, `URL`, `URL301`, `FRAME`.',
  },
  'TXT': {
    description: 'Add a TXT record with this address to the domain.\nAlias for `--record TXT --address <TXT>`.',
    short: 'TXT',
  },
  'A': {
    description: 'Add an `A` record with this address to the domain.\nAlias for `--record A --address <A>`.',
    short: 'A',
  },
  'CNAME': {
    description: 'Add a CNAME record with this address to the domain.\n`--record CNAME --address <CNAME>`.',
    short: 'CNAME',
  },
  'ttl': {
    description: 'When adding host records, sets the _TTL_.\nBy default, namecheap sets 1800.',
  },
  'host': {
    description: 'The host name for adding dns records.',
    default: '@',
  },
  'address': {
    description: 'The address of the new host record.',
  },
  'mxpref': {
    description: 'MX preference for hosts. Applicable to MX records only.',
  },
  'github': {
    description: 'Setup GitHub pages for the apex domain as per docs\nhttps://git.io/fjyr7 Also removes the parking page\nand URL redirect. All other hosts are kept itact.',
    boolean: true,
    short: 'g',
  },
  'delete': {
    description: 'Remove the specified host record.',
    boolean: true,
    short: 'd',
  },
}

export const argsConfigInfo = {
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

export const argsConfigRegister = {
  'promo': {
    description: 'Use this promo code on registration.',
    short: 'p',
  },
  'years': {
    description: 'The number of years that the domain should be registered for.',
    short: 'y',
  },
}

const args = argufy({ ...argsConfig, ...argsConfigCheck, ...argsConfigDns, ...argsConfigInfo, ...argsConfigRegister })

/**
 * The domain name for operations, or multiple domain names
    for checking availability.
 */
export const _domains = /** @type {!Array<string>} */ (args['domains'])

/**
 * Initialise package configuration interactively, i.e.,
    the API key and ip address.
 */
export const _init = /** @type {boolean} */ (args['init'])

/**
 * Show the information for the domain.
 */
export const _info = /** @type {boolean} */ (args['info'])

/**
 * Register the domain.
 */
export const _register = /** @type {boolean} */ (args['register'])

/**
 * Display brief WHOIS data.
 */
export const _whois = /** @type {boolean} */ (args['whois'])

/**
 * Display full WHOIS data.
 */
export const _Whois = /** @type {boolean} */ (args['Whois'])

/**
 * Find this month's coupon.
 */
export const _coupon = /** @type {boolean} */ (args['coupon'])

/**
 * Use the sandbox API.
 */
export const _sandbox = /** @type {boolean} */ (args['sandbox'])

/**
 * Add current IP address to the list of white-listed ones.
 */
export const _whitelistIP = /** @type {boolean} */ (args['whitelistIP'])

/**
 * Display the current version number.
 */
export const _version = /** @type {boolean} */ (args['version'])

/**
 * Show help information.
 */
export const _help = /** @type {boolean} */ (args['help'])

/**
 * Display only free domains.
 */
export const _free = /** @type {boolean} */ (args['free'])

/**
 * Check in these zones only.
 */
export const _zones = /** @type {string} */ (args['zones'])

/**
 * The record type. Can be one of the following:
    `A`, `AAAA`, `ALIAS`, `CAA`, `CNAME`, `MX`, `MXE`,
    `NS`, `TXT`, `URL`, `URL301`, `FRAME`.
 */
export const _record = /** @type {string} */ (args['record'])

/**
 * Add a TXT record with this address to the domain.
    Alias for `--record TXT --address <TXT>`.
 */
export const _TXT = /** @type {string} */ (args['TXT'])

/**
 * Add an `A` record with this address to the domain.
    Alias for `--record A --address <A>`.
 */
export const _A = /** @type {string} */ (args['A'])

/**
 * Add a CNAME record with this address to the domain.
    `--record CNAME --address <CNAME>`.
 */
export const _CNAME = /** @type {string} */ (args['CNAME'])

/**
 * When adding host records, sets the _TTL_.
    By default, namecheap sets 1800.
 */
export const _ttl = /** @type {string} */ (args['ttl'])

/**
 * The host name for adding dns records. Default `@`.
 */
export const _host = /** @type {string} */ (args['host'] || '@')

/**
 * The address of the new host record.
 */
export const _address = /** @type {string} */ (args['address'])

/**
 * MX preference for hosts. Applicable to MX records only.
 */
export const _mxpref = /** @type {string} */ (args['mxpref'])

/**
 * Setup GitHub pages for the apex domain as per docs
    https://git.io/fjyr7 Also removes the parking page
    and URL redirect. All other hosts are kept itact.
 */
export const _github = /** @type {boolean} */ (args['github'])

/**
 * Remove the specified host record.
 */
export const _delete = /** @type {boolean} */ (args['delete'])

/**
 * Sort by this field (name, expire, create).
 */
export const _sort = /** @type {string} */ (args['sort'])

/**
 * Sort in descending order.
 */
export const _desc = /** @type {boolean} */ (args['desc'])

/**
 * Filter by this word.
 */
export const _filter = /** @type {string} */ (args['filter'])

/**
 * The page size.
 */
export const _pageSize = /** @type {string} */ (args['pageSize'])

/**
 * Domain type (ALL, EXPIRING, EXPIRED).
 */
export const _type = /** @type {string} */ (args['type'])

/**
 * Use this promo code on registration.
 */
export const _promo = /** @type {string} */ (args['promo'])

/**
 * The number of years that the domain should be registered for.
 */
export const _years = /** @type {string} */ (args['years'])

/**
 * The additional arguments passed to the program.
 */
export const _argv = /** @type {!Array<string>} */ (args._argv)