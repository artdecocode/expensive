# expensive

[![npm version](https://badge.fury.io/js/expensive.svg)](https://badge.fury.io/js/expensive)

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
import { debuglog } from 'util'

const LOG = debuglog('expensive')
const DEBUG = /expensive/.test(process.env.NODE_DEBUG)

const domains = process.argv.slice(3)

if (!domains.length) {
  console.log('Please enter a domain or domains')
  process.exit()
}

(async () => {
  try {
    const a = await auth({ packageName: 'example' }) // { ApiKey, UserName, ClientIp }
    console.log('Checking %s', domains.join(', '))
    const res = await checkDomains({
      ...a,
      domains,
    })
    if (res.length) {
      console.log('The following are free: %s', res.join(', '))
    } else {
      console.log('All domains are taken')
    }
  } catch ({ stack, message }) {
    DEBUG ? LOG(stack) : console.error(message)
    process.exit(1)
  }
})()
```

```sh
yarn example/ test.co testt.co testtt.co
```

```sh
# yarn expansions
yarn run v1.7.0
yarn e example/example.js test.co testt.co testtt.co
node example example/example.js test.co testt.co testtt.co
```

```fs
Checking test.co, testt.co, testtt.co
The following are free: testtt.co
✨  Done in 3.04s.
```

---

(c) [artdecocode][1] 2018

[1]: https://artdeco.bz
