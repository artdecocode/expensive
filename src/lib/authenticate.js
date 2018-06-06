import rqt from 'rqt'
import { resolve } from 'path'
import { readFileSync } from 'fs'
import { debuglog } from 'util'
const LOG = debuglog('expensive')

let version = 'unknown'
try {
  const path = resolve(__dirname, '../../package.json')
  const f = readFileSync(path)
  ;({ version } = JSON.parse(f))
} catch (err) {/**/}

const authenticate = async () => {
  const ua = `Mozilla/5.0 Expensive (v${version}) https://npmjs.org/package/expensive`
  LOG(ua)
  await rqt('https://www.namecheap.com/myaccount/login.aspx', {
    headers: {
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'en-US,en',
      'User-Agent': ua,
    },
  })
}

export default authenticate
