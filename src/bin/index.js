#!/usr/bin/env node
/* eslint-disable no-console */
import { debuglog, inspect } from 'util'
import argufy from 'argufy'
import africa from 'africa'
import getUsage from './get-usage'
import List from './list'
import Check from './check'
import Register from './reg'
import { getConfig, getInfo } from '..'
import getPrivateConfig from '../lib/private-config'
import printInfo from '../lib/print/info'
import handleRequestIP from '../lib/authenticate/handle-request-ip'
import questions, { privateQuestions } from '../questions'

const LOG = debuglog('expensive')
const DEBUG = /expensive/.test(process.env.NODE_DEBUG)

const {
  domain,
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
} = argufy({
  domain: {
    command: true,
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
}, process.argv)

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
      global: true,
    })
    const { aws_id, aws_key, phone: p } = await getPrivateConfig()
    phone = p
    user = Auth.ApiUser

    if (!domain) {
      await List(Auth, { sort, desc, filter, type, pageSize })
      return
    }

    if (info) {
      const i = await getInfo(Auth, { domain })
      printInfo(i)
      return
    }

    if (register) {
      await Register(Auth, { domain })
      return
    }

    await Check(Auth, {
      domain,
    })
  } catch ({ stack, message, props }) {
    if (props) {
      LOG(inspect(props, { colors: true }))
      LOG(Errors[props.Number])
    }

    if (props && props.Number == 1011150) {
      const authComplete = await handleRequestIP(message, { phone, user, head })
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

; (async () => {
  if (init) {
    await africa('expensive', questions, { force: true })
    await africa('expensive-client', privateQuestions, { force: true })
    return
  }
  await run()
})()
