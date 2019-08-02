import loading from 'indicatrix'
import { c } from 'erte'
import t from 'tablature'
import { confirm } from 'reloquent'
import { inspect } from 'util'
import {
  _record, _address, _CNAME, _TXT, _ttl, _host, _mxpref, _delete,
} from '../get-args'

/**
 * @param {!_namecheap.NameCheap} client
 * @param {string} domain
 */
export default async function (client, domain) {
  const hosts = await loading('Getting current hosts', async () => {
    const { hosts: h, IsUsingOurDNS } = await client.dns.getHosts(domain)
    if (!IsUsingOurDNS)
      throw new Error(`Namecheap DNS is not being used for ${domain}`)
    return h
  })
  let newhosts = hosts.map((h) => {
    const { TTL, Type: RecordType, Address, Name: HostName, MXPref } = h
    const ho = /** @type {!_namecheap.HostParams} */ ({
      TTL, RecordType, Address, HostName, MXPref })
    return ho
  })
  let Address = _address, HostName = _host, RecordType = _record, TTL = _ttl
  // aliases
  if (_CNAME) {
    RecordType = 'CNAME'
    Address = _CNAME
  } else if (_TXT) {
    RecordType = 'TXT'
    Address = _TXT
  }
  /** @type {!_namecheap.HostParams} */
  const host = Object.entries({
    RecordType,
    Address,
    HostName,
    TTL,
    MXPref: _mxpref,
  }).reduce((acc, [key, val]) => {
    if (val) acc[key] = val
    return acc
  }, {})

  const y = inspect(host, { colors: true, breakLength: 50, compact: false })

  if (_delete) {
    const prevLength = newhosts.length
    newhosts = newhosts.filter(h => {
      const different = Object.entries(host).some(([key, value]) => {
        const originalValue = h[key]
        return value != originalValue
      })
      return different
    })
    if (newhosts.length == prevLength) {
      console.log('Host %s not found. Existing hosts:', y)
      console.log()
      print(newhosts)
      return
    }
    const ans = await confirm(`Are you sure you want to unset ${y}`)
    if (!ans) return
  } else newhosts.push(host)

  const r = await loading(`Setting ${c(`${newhosts.length}`, 'yellow')} host records`, async () => {
    const res = await client.dns.setHosts(domain, newhosts)
    return res
  })
  if (!r.IsSuccess)
    throw new Error('Operation wasn\'t successful.')

  console.log('Successfully %s %s on %s. New hosts:',
    _delete ? 'deleted' : 'set', y, domain)
  console.log()
  print(newhosts)
}

const print = (data) => {
  console.log(t({
    headings: { HostName: 'Name', RecordType: 'Type' },
    data,
    keys: ['HostName', 'RecordType', 'Address'],
  }))
}

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('@rqt/namecheap')} _namecheap.NameCheap
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('@rqt/namecheap/types/typedefs/dns').HostParams} _namecheap.HostParams
 */
