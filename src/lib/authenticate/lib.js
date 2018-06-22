import { askSingle } from 'reloquent'
import { c } from 'erte'

export const extractOptions = (body) => {
  const re = /<option value="(\d+-phone)">(.+?(\d\d\d))<\/option>/g
  let res
  const options = []
  while ((res = re.exec(body)) !== null) {
    const [, value, title, last] = res
    options.push({
      value,
      title,
      last,
    })
  }
  return options
}

const numberRe = /(.+?)(\d\d\d)$/

const mapPhoneOptions = o => {
  const r = numberRe.exec(o)
  if (!r) return o
  const [, g, n] = r
  const gr = c(g, 'grey')
  const co = `${gr}${n}`
  return co
}

export const askForNumber = async (options, phone) => {
  const text = `Which phone number to use for 2 factor auth
${
  options
    .map(({ title }) => ` ${title}`)
    .map(mapPhoneOptions)
    .join('\n')
}
enter last 3 digits`

  const answer = await askSingle({
    text,
    async getDefault() {
      return phone || options[0].last
    },
    validation(a) {
      const p = options.some(({ last }) => last == a)
      if (!p) {
        throw new Error('Unknown number entered.')
      }
    },
  })

  const { value } = options.find(({ last }) => last == answer)
  return value
}

export const extractFormState = (body) => {
  const re = /<input type="hidden" name="__(\w+)" id="__\w+" value="(.*?)" \/>/g
  let res
  const inputs = []
  while ((res = re.exec(body)) !== null) {
    const [, name, value] = res
    inputs.push({
      name,
      value,
    })
  }
  const r = inputs.reduce((acc, { name, value }) => {
    return {
      ...acc,
      [`__${name}`]: value,
    }
  }, {})
  return r
}
