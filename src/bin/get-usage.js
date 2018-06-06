
const u = {
  domain: 'check a domain name in various startupy zones\n(.io, .cc, .co, .bz, .app)',
  'domain.com': 'check a domain name',
  'domain1.com domain2.com': 'check multiple domain names',
}
const commands = Object.keys(u)
const descriptions = Object.values(u)

export default () => {
  const [commandLength] = commands.reduce(([longestName = 0, longestDescription = 0], name) => {
    /** @type {string} */
    const command = u[name]
    const theLongest = command.split('\n')
      .reduce((acc, c) => {
        if (c.length > acc) return c.length
        return acc
      }, 0)
    if (theLongest > longestDescription) longestDescription = theLongest
    if (name.length > longestName) longestName = name.length
    return [longestName, longestDescription]
  }, [])

  const pad = (string, length) => {
    const l = length - string.length
    const t = Array.from({ length: l })
    const ts = t.map(_ => ' ').join('') // eslint-disable-line no-unused-vars
    const s = `${string}${ts}`
    return s
  }

  const usa = commands.reduce((acc, command, i) => {
    const value = descriptions[i]
    const vals = value.split('\n')
    const c = pad(command, commandLength)
    const [firstVal, ...otherVals] = vals
    const firstLine = `${c}\t${firstVal}`
    const emptyPad = pad('', commandLength)
    const otherLines = otherVals.map(val => {
      const r = `${emptyPad}\t${val}`
      return r
    })
    const res = [...acc, firstLine, ...otherLines]
    return res
    // const v = vals.map(va => {
    //   const p = pad(va, descriptionLength)
    //   return p
    // })
    // const valu = v.join(`\n${emptyPad}\t`)
    // const s = `${c}\t${valu}`
    // return [...acc, s]
  }, [])

  const USA = usa.map(a => `\t${a}`)
  const usage = `Usage:
  expensive
${USA.join('\n')}
`.trim()

  return usage
}
