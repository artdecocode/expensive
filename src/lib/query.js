import rqt from 'rqt'
import { stringify } from 'querystring'
import { debuglog } from 'util'
import erotic from 'erotic'
import { extractTag } from '.'

const LOG = debuglog('expensive')

/** @param {string} s */
const isXml = s => s.startsWith('<?xml version="1.0" encoding="utf-8"?>')

export default async function query({
  ApiUser,
  ApiKey,
  ClientIp,
}, Command, Options = {}) {
  const cb = erotic()
  if (!Command) throw new Error('Command must be passed')
  const qs = stringify({
    ApiUser,
    ApiKey,
    UserName: ApiUser,
    ClientIp,
    Command,
    ...Options,
  })
  const url = `https://api.${process.env.SANDBOX ? 'sandbox.' : ''}namecheap.com/xml.response?${qs}`
  LOG(url)
  const res = await rqt(url)
  const xml = isXml(res)
  if (!xml) throw new Error('non-xml response')

  const error = getError(res)
  if (error) {
    throw cb(error)
  }

  const [{ content: CommandResponse }] = extractTag('CommandResponse', res)

  return CommandResponse
}

export const getError = (res) => {
  const [{ content: Errors }] = extractTag('Errors', res)
  if (Errors.length) {
    const errors = extractTag('Error', Errors)

    let c
    let p
    if (errors.length == 1) {
      const [{ content, props }] = errors
      c = content
      p = props
    } else {
      c = errors.map(({ content }) => content).join('; ')
      p = errors.map(({ props }) => props)
    }
    const er = new Error(c)
    er.props = p

    return er
  }
}
