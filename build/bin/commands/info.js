const t = require('tablature');
const printInfo = require('../../lib/print/info');

/**
 * @param {import('@rqt/namecheap')} client
 */
async function info(client, domain) {
  const [i, hosts] = await Promise.all([
    client.domains.getInfo(domain),
    client.dns.getHosts(domain),
  ])
  printInfo(i)
  if (hosts.IsUsingOurDNS) {
    console.log()
    console.log(t({
      headings: ['Name', 'Type', 'Address'],
      data: hosts.hosts,
      keys: ['Name', 'Type', 'Address'],
    }))
  }
}

module.exports = info