// import t from 'tablature'
// import printInfo from '../../lib/print/info'
import loading from 'indicatrix'
import { confirm } from 'reloquent'
import { c } from 'erte'

/**
 * @param {import('@rqt/namecheap')} client
 */
export default async function (client, domain) {
  let { hosts, IsUsingOurDNS } = await client.dns.getHosts(domain)
  if (!IsUsingOurDNS)
    throw new Error(`Namecheap DNS is not being used for ${domain}`)

  hosts.reduce(async (ac, { Type, Name, Address }) => {
    await ac
    if (Type == 'A' && Name == '@') {
      const a = await confirm(
        `An A record at @ (${Address}) already exists. Continue?`)
      if (!a) process.exit()
    }
  }, {})

  hosts = hosts.filter(({ Type, Name, Address }) => {
    if (Name == 'www' && Type == 'CNAME' && Address == 'parkingpage.namecheap.com.') return false
    if (Name == '@' && Type == 'URL') return false
    return true
  })
  hosts.forEach((h) => {
    h.RecordType = h.Type
    h.HostName = h.Name
  })
  hosts.push({
    Address: '185.199.108.153',
    RecordType: 'A',
    HostName: '@',
  },{
    Address: '185.199.109.153',
    RecordType: 'A',
    HostName: '@',
  },  {
    Address: '185.199.110.153',
    RecordType: 'A',
    HostName: '@',
  }, {
    Address: '185.199.111.153',
    RecordType: 'A',
    HostName: '@',
  })

  const r = await loading(`Setting ${c(hosts.length, 'yellow')} host records`, async () => {
    const res = await client.dns.setHosts(domain, hosts)
    return res
  })
  if (!r.IsSuccess)
    throw new Error('Operation wasn\'t successful.')
}