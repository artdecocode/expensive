const tablature = require('tablature');
const { mapDomains, getWhois: WhoisGuard } = require('..');

function printList(domains = []) {
  if (!domains.length) {
    console.log('No domains')
    return
  }
  const data = mapDomains(domains)
  const s = tablature({
    keys: ['Name', 'Expiry', 'Years', 'WhoisGuard', 'DNS'],
    data,
    headings: {
      WhoisGuard: 'Whois',
    },
    replacements: {
      WhoisGuard,
      DNS(val) {
        if (val) return { value: 'yes', length: 3 }
        return { value: '', length: 0 }
      },
      Years(value) {
        if (value) return { value, length: `${value}`.length }
        return { value: '', length: 0 }
      },
    },
    centerValues: ['WhoisGuard'],
  })
  console.log(s)
}



module.exports = printList