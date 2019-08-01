import t from 'tablature'
import printInfo from '../../lib/print/info'

/**
 * @param {!_namecheap.NameCheap} client
 * @param {string} domain
 */
export default async function info(client, domain) {
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

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('@rqt/namecheap')} _namecheap.NameCheap
 */
