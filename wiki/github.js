import NameCheap from '@rqt/namecheap'
import getConfig from '../src/lib/get-config'

(async () => {
  const Settings = await getConfig(true)
  const nc = new NameCheap({
    user: Settings.ApiUser,
    key: Settings.ApiKey,
    ip: '10.10.10.10',
    sandbox: true,
  })
  const res = await nc.dns.setHosts('expensive-github.com', [
    {
      Address: 'parkingpage.namecheap.com.',
      RecordType: 'CNAME',
      HostName: 'www',
    },
    {
      Address: 'http://www.expensive-github.com/?from=@',
      RecordType: 'URL',
      HostName: '@',
    },
  ])
  console.error(res)
  require('../src/bin/expensive')
})()