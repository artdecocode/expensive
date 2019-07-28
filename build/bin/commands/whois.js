const NamecheapWeb = require('@rqt/namecheap-web');

const getDays = (date) => {
  const d = new Date().getTime() - date.getTime()
  return Math.round(d / (1000*60*60*24))
}

const getItem = (whois, item, key, type, print) => {
  try {
    const isDate = type == 'date'
    const isArray = type == 'array'
    const re = new RegExp(`^${item}: (.+)`, 'mg')
    const allRes = []
    let res
    while ((res = re.exec(whois)) !== null) {
      const [, val] = res
      const v = isDate ? new Date(val) : val
      allRes.push(v)
    }
    const val = isArray ? allRes.join('\n ') : allRes[0]
    const s = print(item, isDate ? val.toLocaleString() : val, isDate ? getDays(val) : null)
    return { [key]: s }
  } catch (err) {
    return {}
  }
}

const getData = (whois) => {
  return [
    ['Domain Name', 'name', 'string', (i, v) => `${i}: ${v}`],
    ['Registrar URL', 'url', 'string', (i, v) => `${i}: ${v}`],
    ['Updated Date', 'updated', 'date', (i, v, d) => `${i}: ${v} (${d} ${days(d)} ago)`],
    ['Creation Date', 'created', 'date', (i, v, d) => `${i}: ${v} (${d} ${days(d)} ago)`],
    ['Registry Expiry Date', 'expire', 'date', (i, v, d) => `${i}: ${v} (in ${-d} ${days(-d)})`],
    ['Name Server', 'ns', 'array', (i, v) => `${i}: ${v}`],
  ].reduce((acc, [i, k, t, p]) => {
    const item = getItem(whois, i, k, t, p)
    return { ...acc, ...item }
  }, {})
}

const days = (n) => {
  if (n == 1) return 'day'
  return 'days'
}

module.exports=async (domain, full) => {
  const res = await NamecheapWeb.WHOIS(domain)
  if (full) return console.log(res)
  const data = getData(res)
  Object.values(data).forEach(v => console.log(v))
}