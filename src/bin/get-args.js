import argufy from 'argufy'

const getArgs = () => {
  const {
    domains,
    help,
    init,
    version,
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
}

export default getArgs