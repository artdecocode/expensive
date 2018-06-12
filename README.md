# expensive

[![npm version](https://badge.fury.io/js/expensive.svg)](https://badge.fury.io/js/expensive)

`expensive` is a [namecheap.com](https://namecheap.com) client to check domain availability, register domains, create Route 53 record zones and control domains' name servers via the CLI. The package significantly reduces the chore associated with performing these routine operations when creating new websites.

```sh
# install node with nvm https://github.com/creationix/nvm
npm i -g expensive
```

The CLI client can also perform web-based authentication via Chrome's automation to white-list IP addresses (useful when having dynamic IPs).

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [Settings](#settings)
- [Reporting](#reporting)
- [Route 53](#route-53)
- [CLI](#cli)
  * [Domain Check](#domain-check)
    * [Tech Zones](#tech-zones)
    * [Single Domains](#single-domains)
  * [`-i`, `--info`: Domain Information](#-i---info-domain-information)
  * [`-d`, `--dns`: Manage DNS](#-d---dns-manage-dns)
  * [`-r`, `--register`: Register Domain](#-r---register-register-domain)
  * [`-I`, `--init`: Initialise Configuration](#-i---init-initialise-configuration)
  * [`-v`, `--version`: Print Version](#-v---version-print-version)
  * [`-h`, `--help`: Print Usage](#-h---help-print-usage)
- [API](#api)
  * [`getConfig(options: Object): Config`](#getconfigoptions-object-config)
  * [`checkDomains(options: Object): Array`](#checkdomainsoptions-object-array)
- [Security](#security)
- [Errors and Troubleshooting](#errors-and-troubleshooting)
  * [`getaddrinfo ENOTFOUND api.namecheap.com api.namecheap.com:443`](#getaddrinfo-enotfound-apinamecheapcom-apinamecheapcom443)

## Settings

Upon the first run the program will ask a series of questions:

```fs
username: <namecheap-username>
api key https://ap.www.namecheap.com/settings/tools/apiaccess/: <api key accessed at the given page>
client ip [10.10.10.10]: <the ip>
```

After they've been answered, `expensive` will remember the answers and store them in `.expensiverc` file in the home directory, and use this data for all subsequent calls to the API. These are also available to other programs which want to use the API and can be read with `getConfig` when using the package programmatically (see below).

There are additional questions which are required for specific features:

```
Last 3 digit of phone to use for 2 factor auth: <055>
AWS access key id: <aws-key-id>
AWS secret access key: <aws-key>
```

These are stored in the `.expensive-client.rc` and are not shared with other software.

The last 3 digits will be used to automatically login and white-list an IP address, and AWS keys are used for Route 53 access.

## Reporting

To see the status of a single or all domains printed in the console, use the info extension (`-i`).

 ```sh
expensive -i example1.com
```

| domain       | expire in | dns         | visits | google |
|--------------|-----------|-------------|--------|--------|
| example1.com | 189 days  | dns.dns.com | 550    | 3      |
|              |           |             |        |        |

```sh
expensive --info
```

| domain       | expire in | dns         | visits | google |
|--------------|-----------|-------------|--------|--------|
| example1.com | 189 days  | dns.dns.com | 550    | 3      |
| example2.com |  61 days  |  namecheap  | -      | -      |
|              |           |             |        |        |

## Route 53

Creation of the hosted zones is implemented with Route 53 API. A new hosted zone can be created for a domain, and its name servers set via namecheap API.

```sh
expensive example.com -r
# create a hosted zone and assign name servers
```

## CLI

The program can be used from a terminal.

```fs
  expensive -Ihv [domain.co]

        domain          check a domain name in various tech zones
                        (.co, .cc, .io, .bz, .app)
        domain.com      check a domain name
        -h, --help      print usage information
        -v, --version   print package's version
```

### Domain Check

To perform whether a domain is free or taken, simply pass the domain name.

#### Tech Zones

To start a domain check in 5 tech zones, enter a word without a domain, e.g.,

```sh
expensive testt
```

<details>
  <summary>Preview tech zones check</summary>
  <table>
  <tr><td>
    <img alt="testing a domain in tech zones" src="doc/tech.gif" />
  </td></tr>
  <tr><td>
  </td></tr>
  </table>
</details>

#### Single Domains

To check a single domain, pass the domain name, e.g.,

```sh
expensive testt.co
```


<details>
  <summary>Preview single domain check</summary>
  <table>
  <tr><td>
    <img alt="testing a single domain" src="doc/single.gif" />
  </td></tr>
  <tr><td>
      </td></tr>
  </table>
</details>

### `-i`, `--info`: Domain Information

```sh
expensive -i example.co
```

View the domain information. If domain is registered with `namecheap`, it will print information available from the account.

### `-d`, `--dns`: Manage DNS

```sh
expensive -d example.co [10.10.10.10,11.11.11.11]
```

Manage DNS records for the domain.

### `-r`, `--register`: Register Domain

```sh
expensive -r testt.co
```

Register a domain name.

### `-I`, `--init`: Initialise Configuration

```sh
expensive -I
```

Force updating of the configuration (`HOMEDIR/.expensiverc` and `HOMEDIR/.expensive-clientrc`) files. The new values will override the existing ones.

### `-v`, `--version`: Print Version

```sh
expensive -v
```

Display the version information.

### `-h`, `--help`: Print Usage

```sh
expensive -v
```

Print the help information.

## API
On top of the CLI application, the package provides means to query _namecheap_ API.

### `getConfig(options: Object): Config`

Reads the `rc` file (or ask questions to create one) for given details: if `global` is set to true, the `HOME/.expensiverc` is looked up, and if `packageName` is provided, the `rc` file at `.${packageName}-expensiverc` is used for storing and reading of configuration. This makes possible for other libraries to refer to the same `rc` file with the API key, or have separate configurations.

- `packageName`: name of the package implementing `expensive`, or
- `global`: a boolean to indicate that the global `.expensiverc` should be used
- `opts`: other options accepted by [`africa`](https://npmjs.org/package/africa).

The `rc` file will only contain the following details required for API calls:

```sh
{
  "ApiUser": "namecheap_user",
  "ApiKey": "api_key_from_tools",
  "ClientIp": "10.10.10.10"
}
```

Client IP does not seem to have to be correct, although it has to be present and non-white-listed IPs won't work.

### `checkDomains(options: Object): Array`

This method returns a list of free domains for the request. Either domains, or a single domain must be passed. The method also expects to see Auth details (from the config object), and these can be passed by using the destructuring.

- `domains` an array of domains
- `domain` a single domain

```js
/* example/example.js */
/* yarn example/ */
import { getConfig, checkDomains } from 'expensive'
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
    // use `.expensive-example.rc` file to get configuration data
    // pass `global` to read `.expensiverc` instead
    const Auth = await getConfig({ packageName: 'example' })

    console.log('Checking %s', domains.join(', '))
    const res = await checkDomains({
      ...Auth,
      domains,
    })
    if (res.length) {
      console.log('The following are free: %s', res.join(', '))
    } else {
      console.log('All domains are taken.')
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

## Security

When white-listing the IP addresses via the Chrome automation script, `expensive` will use the username stored in the config file, and ask for the password. The password is not stored anywhere apart from the program's memory and then used for authorisation on the `namecheap.com` website, and as a confirmation password when adding a new white-listed IP address.

You can install the package from github after you're happy with the source code, using the following command:

```sh
npm i -g artdecocode/expensive#v1.2.0
```

This will fetch the package from GitHub, and not registry. If it was possible to see the git sha sum of the commit in `yarn info package` then it would not have been necessary, because one can compare source code against the commit number. By installing from GitHub directly, one can know what they install.

## Errors and Troubleshooting

`expensive` will display an error text when an error happens during its execution.

### `getaddrinfo ENOTFOUND api.namecheap.com api.namecheap.com:443`

This error means that there's no internet access.

Check that the computer is connected to the internet.

---

(c) [Art Deco Code][1] 2018

[1]: https://artdeco.bz
[2]: https://appshot.io
