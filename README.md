# expensive

```sh
npm i -g expensive
```

`expensive` is a Namecheap.com API client to check domain availability, register, create Route 53 record zone and assign name servers via CLI. The package significantly reduces the chore associated with doing all these routine things.

## Settings Initialisation

Upon the first run the program will ask a series of questions:

```
username: <namecheap-username>
api key https://ap.www.namecheap.com/settings/tools/apiaccess/: <api key accessed at the given page>
client ip https://www.google.co.uk/search?q=my+ip: <the ip>
```

After they've been answered, the program will remember the answers and store them in `.expensiverc` file the the home directory, and use this data for all subsequent calls to the API.

## `CLI`

The usage is as follows:

```fs
expensive
  domain          check a domain name in various startupy zones
                  (.io, .cc, .co, .bz, .app)
  domain.com      check a domain name
```

```sh
expensive test
```

```fs
Checking 5 domains: test.co, test.cc, test.io, test.bz, test.app
None of the zones are available.
```


```sh
expensive testt
```

![output for testt query](doc/testt.png)

## API

The package also supports a Node.js API. The authentication is completed in the same way as the CLI, that is by reading the `.expensiverc` file. If `global` parameter is not set to true, and the `packageName` is not given, the function will throw. You must provide either a `packageName` or set `global` to true so that the `~/.expensiverc` can be read. N-O-N-E-T-H-E-L-E-S-S it is a good idea to provide a `packageName` so that a personal config in form of `.${packageName}-expensiverc` is generated.

```js
/* example/example.js */
/* yarn example/ */
import { auth, checkDomains } from 'expensive'
import { basename } from 'path'
import { debuglog } from 'util'

const LOG = debuglog('expensive')
const DEBUG = /expensive/.test(process.env.NODE_DEBUG)

const b = basename(__filename)
const dd = process.argv.find((a) => {
  return a.endsWith(b)
})
const i = process.argv.indexOf(dd)
const j = i + 1
const domains = process.argv.slice(j)

if (!domains.length) {
  console.log('Please enter a domain or domains')
  process.exit(1)
}

(async () => {
  try {
    const a = await auth({ packageName: 'example' }) // { ApiKey, UserName, ClientIp }
    const res = await checkDomains({
      ...a,
      domains,
    })
    console.log(res)
  } catch ({ stack, message }) {
    DEBUG ? LOG(stack) : console.error(message)
    process.exit(1)
  }
})()
```

---

(c) [artdecocode][1] 2018

[1]: https://artdeco.bz
