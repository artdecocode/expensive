const printInfo = require('../../lib/print/info');

/**
 * @param {import('@rqt/namecheap')} client
 */
               async function info(client, domain) {
  const i = await client.domains.getInfo(domain)
  printInfo(i)
}

module.exports = info