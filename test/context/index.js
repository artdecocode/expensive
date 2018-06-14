import africa from 'africa'

process.env.SANDBOX = true

const p = africa('expensive-test', {
  ApiUser: 'api user',
  ApiKey: 'api key',
}, { homedir: __dirname })

/**
 * A testing context for the package.
 */
export default class Context {
  async _init() {
    const config = await p
    this.config = config
  }
  /**
   * Example method.
   */
  example() {
    return 'OK'
  }
  get Auth() {
    return {
      ...this.config,
      ClientIp: '127.0.0.1',
    }
  }
  async _destroy() {
  }
}
