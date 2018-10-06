import printInfo from '../../lib/print/info'

/**
 * @param {import('@rqt/namecheap')} client
 */
export default async function info(client, domain) {
  const i = await client.domains.getInfo(domain)
  printInfo(i)
}