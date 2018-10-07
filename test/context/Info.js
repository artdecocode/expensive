import NameCheap from '@rqt/namecheap'
import bosom from 'bosom'
import { homedir } from 'os'
import { join } from 'path'
import Context from '.'

export default class InfoContext extends Context {
  async _init() {
    const p = join(homedir(), '.expensive-sandboxrc')
    const { ApiUser, ApiKey, ClientIp } = await bosom(p)
    const nc = new NameCheap({
      sandbox: true,
      user: ApiUser,
      key: ApiKey,
      ip: ClientIp,
    })
    const addresses = await nc.address.getList()
    const { AddressId } = addresses.find(({ IsDefault }) => IsDefault)
    const address = await nc.address.getInfo(AddressId)
    this.fullDomain = `${this.domain}.com`
    await nc.domains.create({
      address,
      domain: this.fullDomain,
    })
  }
}