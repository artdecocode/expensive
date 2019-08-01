/** @type {string} */
process.env.SANDBOX
/** @type {string} */
process.env.NODE_DEBUG

/* typal types/settings.xml externs */
/** @const */
var _expensive = {}
/**
 * Settings saved in ~/.namecheaprc file.
 * @record
 */
_expensive.Settings
/**
 * Namecheap user.
 * @type {string}
 */
_expensive.Settings.prototype.ApiUser
/**
 * Namecheap API key.
 * @type {string}
 */
_expensive.Settings.prototype.ApiKey
/**
 * Client IP.
 * @type {string}
 */
_expensive.Settings.prototype.ClientIp
/**
 * Last 3 digits of the phone number.
 * @type {string}
 */
_expensive.Settings.prototype.phone
