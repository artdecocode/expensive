#!/usr/bin/env node
import { debuglog, inspect } from 'util'
import africa from 'africa'
import getUsage from './get-usage'
import List from './list'
import Check from './check'
import Register from './reg'
import { getConfig } from '..'
import getPrivateConfig from '../lib/private-config'
import printInfo from '../lib/print/info'
import questions, { privateQuestions } from '../questions'
import Namecheap from '../Namecheap'
import handleIp from '../lib/web/handle-ip'
import handleWhitelist from '../lib/web/handle-whitelist'
import Errors from './errors.json'
import { version } from '../../package.json'
import getArgs from './get-args'

const LOG = debuglog('expensive')
const DEBUG = /expensive/.test(process.env.NODE_DEBUG)
const SANDBOX = !!process.env.SANDBOX

const {
  domains: _domains,
  help: _help,
  init: _init,
  version: _version,
  info: _info,
  sort: _sort, // name, expire, create
  desc: _desc,
  filter: _filter,
  type: _type,
  pageSize: _pageSize,
  register: _register,
  free: _free,
  zones: _zones,
  whitelistIP: _whitelistIP,
} = getArgs()

if (_version) {
  console.log(version)
  process.exit()
} else if (_help) {
  const u = getUsage()
  console.log(u)
  process.exit()
}

const run = async (name) => {
  /** @type {string} */
  let phone
  /** @type {string} */
  let user
  try {
    const Auth = await getConfig({
      global: !SANDBOX,
      packageName: SANDBOX ? 'sandbox' : null,
    })
    ;({ phone } = await getPrivateConfig()) // aws_id, aws_key,
    user = Auth.ApiUser

    await handleWhitelist(whitelistIP)

    const nc = new Namecheap(Auth)

    if (!domains) {
      await List(nc, { sort, desc, filter, type, pageSize })
      return
    }

    const [domain] = domains

    if (info) {
      const i = await nc.domains.getInfo({ domain })
      printInfo(i)
      return
    }

    if (register) {
      await Register(nc, { domain })
      return
    }

    await Check(nc, {
      domains,
      zones,
      free,
    })
  } catch ({ stack, message, props }) {
    if (props) {
      LOG(inspect(props, { colors: true }))
      LOG(Errors[props.Number])
    }

    const ip = await handleIp({
      message,
      phone,
      user,
      name,
      props,
    })
    if (ip) {
      run(name)
      return
    }

    DEBUG ? LOG(stack) : console.error(message)
    process.exit(1)
  }
}

const getAppName = () => {
  const e = `${process.env.SANDBOX ? 'sandbox-' : ''}expensive`
  return e
}

const initConfig = async (name) => {
  const Auth = await africa(name, questions, { force: true })
  const client = await africa(`${name}-client`, privateQuestions, { force: true })
  return {
    Auth,
    client,
  }
}

(async () => {
  const name = getAppName()
  if (init) return initConfig(name)
  await run(name)
})()