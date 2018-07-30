// const run = async () => {
//   let phone
//   let user
//   try {
//     const Auth = await getConfig({
//       global: !SANDBOX,
//       packageName: SANDBOX ? 'sandbox' : null,
//     })
//     const { aws_id, aws_key, phone: p } = await getPrivateConfig()
//     phone = p
//     user = Auth.ApiUser
//     if (whitelistIP) {
//       const err = new Error()
//       err.props = {
//         Number: 1011150,
//       }
//       LOG('waiting for ip...')
//       const ip = await rqt('https://api.ipify.org') //  '127.0.0.1' //
//       err.message = `Invalid request IP: ${ip}`
//       throw err
//     }
//     const nc = new Namecheap(Auth)
//     if (!domains) {
//       await List(nc, { sort, desc, filter, type, pageSize })
//       return
//     }
//     const [domain] = domains
//     if (info) {
//       const i = await nc.domains.getInfo({ domain })
//       printInfo(i)
//       return
//     }
//     if (register) {
//       await Register(nc, { domain })
//       return
//     }
//     await Check(nc, {
//       domains,
//       zones,
//       free,
//     })
//   } catch ({ stack, message, props }) {
//     if (props) {
//       LOG(inspect(props, { colors: true }))
//       LOG(Errors[props.Number])
//     }
//     DEBUG ? LOG(stack) : console.error(message)
//     process.exit(1)
//   }
// }
// ; (async () => {
//   if (init) {
//     await initConfig()
//     return
//   }
//   await run()
// })()
"use strict";
//# sourceMappingURL=index.js.map