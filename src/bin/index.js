#!/usr/bin/env node
/* eslint-disable no-console */
import { debuglog, inspect } from 'util'
import argufy from 'argufy'
import africa from 'africa'
import getUsage from './get-usage'
import List from './list'
import Check from './check'
import Register from './reg'
import { getConfig } from '..'
import getPrivateConfig from '../lib/private-config'
import printInfo from '../lib/print/info'
import handleRequestIP from '../lib/authenticate/handle-request-ip'
import questions, { privateQuestions } from '../questions'
import Namecheap from '../Namecheap'
import rqt from 'rqt'

const LOG = debuglog('expensive')
const DEBUG = /expensive/.test(process.env.NODE_DEBUG)
const SANDBOX = !!process.env.SANDBOX

const {
  domains,
  help,
  init,
  version,
  head,
  info,
  sort, // name, expire, create
  desc,
  filter,
  type,
  pageSize,
  register,
  free,
  zones,
  whitelistIP,
} = argufy({
  domains: {
    command: true,
    multiple: true,
  },
  version: {
    short: 'v',
    boolean: true,
  },
  help: { short: 'h', boolean: true },
  init: { short: 'I', boolean: true },
  head: { short: 'H', boolean: true },
  info: { short: 'i', boolean: true },
  // <INFO>
  sort: 's', // add validation to argufy
  desc: { short: 'd', boolean: true },
  filter: { short: 'f' },
  pageSize: { short: 'p' },
  type: 't', // add description to argufy, so that usage can be passed to usually
  // </INFO>
  register: { short: 'r', boolean: true },
  free: { short: 'f', boolean: true },
  zones: 'z',
  whitelistIP: { short: 'W', boolean: true },
})

if (version) {
  const { version: v } = require('../../package.json')
  console.log(v)
  process.exit()
}

if (help) {
  const u = getUsage()
  console.log(u)
  process.exit()
}

const run = async () => {
  let phone
  let user
  try {
    const Auth = await getConfig({
      global: !SANDBOX,
      packageName: SANDBOX ? 'sandbox' : null,
    })
    const { aws_id, aws_key, phone: p } = await getPrivateConfig()
    phone = p
    user = Auth.ApiUser

    if (whitelistIP) {
      const err = new Error()
      err.props = {
        Number: 1011150,
      }
      LOG('waiting for ip...')
      const ip = await rqt('https://api.ipify.org') //  '127.0.0.1' //
      err.message = `Invalid request IP: ${ip}`
      throw err
    }

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

    if (props && props.Number == 1011150) {
      const authComplete = await handleRequestIP(message, { phone, user, head, skipPhoneAuth: SANDBOX })
      if (authComplete === true) {
        await run()
        // update the configuration to reflect the IP
        // modify `africa` to be able to update the configuration
      } else {
        console.log(authComplete)
      }
      return
    }

    DEBUG ? LOG(stack) : console.error(message)
    process.exit(1)
  }
}

const Errors = {
  1011150: 'Parameter RequestIP is invalid',
  2030166: 'Domain is invalid',
}

const getAppName = () => {
  const e = `${process.env.SANDBOX ? 'sandbox-' : ''}expensive`
  return e
}

const initConfig = async () => {
  const name = getAppName()
  const Auth = await africa(name, questions, { force: true })
  const client = await africa(`${name}-client`, privateQuestions, { force: true })
  return {
    Auth,
    client,
  }
}

; (async () => {
  if (init) {
    await initConfig()
    return
  }
  await run()
})()
