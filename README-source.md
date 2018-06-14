# expensive

[![npm version](https://badge.fury.io/js/expensive.svg)](https://badge.fury.io/js/expensive)

`expensive` is a [namecheap.com](https://namecheap.com) client to check domain availability, register domains, create Route 53 record zones and control domains' name servers via the CLI. The package significantly reduces the chore associated with performing these routine operations when creating new websites.

```sh
# install node with nvm https://github.com/creationix/nvm
npm i -g expensive
```

The CLI client can also perform web-based authentication via Chrome's automation to white-list IP addresses (useful when having dynamic IPs).

## Table Of Contents

%TOC%

## Configuration

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

<!-- ## Reporting -->

<!-- To see the status of a single or all domains printed in the console, use the info extension (`-i`). -->

 <!-- If google position ranking is set up with `-g example.ne`, then the information utility will print the rank for the configured keyword.  -->

<!-- Visits are accessed from [demimonde.cc](https://demimonde.cc) which is an elastic search gathering engine. -->

<!-- ```sh
expensive -i example1.com
``` -->

<!-- | domain       | expire in | dns         | visits | google |
|--------------|-----------|-------------|--------|--------|
| example1.com | 189 days  | dns.dns.com | 550    | 3      |
|              |           |             |        |        | -->

<!-- ```sh
expensive --info
``` -->

<!-- | domain       | expire in | dns         | visits | google |
|--------------|-----------|-------------|--------|--------|
| example1.com | 189 days  | dns.dns.com | 550    | 3      |
| example2.com |  61 days  |  namecheap  | -      | -      |
|              |           |             |        |        | -->

<!-- ## Health Check

Run a health check against a domain. This will make Chrome visit the page and check that it loads.

```sh
expensive -h example.com
``` -->

<!-- ### Route 53

Creation of the hosted zones is implemented with Route 53 API. A new hosted zone can be created for a domain, and its name servers set via namecheap API.

```sh
expensive example.com -r
# create a hosted zone and assign name servers
``` -->

## CLI

The program can be used from a terminal.

```fs
  expensive [domain|domain.com] -irIHhv -r53

    domain              check a domain name in various tech zones
                        (.co, .cc, .io, .bz, .app)
    domain.com          check a domain name
    -i, --info          display info on domain
    -r, --register      register a domain
    -r53, --route53     assign a hosted zone
    -I, --init          interactively initialise the configuration
    -h, --help          print usage information
    -v, --version       print package's version
    -H, --headless      use headless Chrome for auth
```

### Check Tech Zones

<!-- To perform whether a domain is free or taken, simply pass the domain name. -->

To start a domain check in 5 tech zones, enter a word without a domain, e.g.,

<details>
  <summary><code>expensive testt</code></summary>
  <table>
  <tr><td>
    <img alt="Checking a domain in tech zones." src="doc/tech.gif" />
  </td></tr>
  </table>
</details>

### Check Single Domains

To check a single domain, pass the domain name, e.g.,

<details>
  <summary><code>expensive testt.co</code></summary>
  <table>
  <tr><td>
    <img alt="Checking a single domain." src="doc/single.gif" />
  </td></tr>
  </table>
</details>

### Show Domain Information

View the domain information. If domain is registered with `namecheap`, it will print information available from the account.

<details>
  <summary><code>expensive example.co -i</code></summary>
  <table>
  <tr><td>
    <img alt="Viewing information for a single domain." src="doc/info.gif" />
  </td></tr>
  </table>
</details>

### Set DNS

To or assign DNS values for a given domain, the `-d` (or `--dns`) command can be used. All items should be separated with a comma.

<details>
  <summary><code>expensive example.co -d 10.10.10.10,11.11.11.11</code></summary>
  <table>
  <tr><td>
    <img alt="Assigning new DNS values." src="doc/dns.gif" />
  </td></tr>
  </table>
</details>

### Set Route 53

To automatically create a new hosted zone on `Route 53`, and assign its nameservers to the domain, the `-r53` option can be passed.

<details>
  <summary><code>expensive example.co -r53</code></summary>
  <table>
  <tr><td>
    <img alt="Creating and assigning a route 53 zone." src="doc/route-53.gif" />
  </td></tr>
  </table>
</details>

### Register Domain

Domain registration from the command-line is made easy by `expensive`. Pass `-r` flag to buy a domain name.

<details>
  <summary><code>expensive example.co -r</code></summary>
  <table>
  <tr><td>
    <img alt="Buying a domain name." src="doc/register.gif" />
  </td></tr>
  </table>
</details>

### Initialise Configuration

To update the stored configuration values (e.g., to change an `API` key), run the `-I` (or `--init`) command. See [Configuration](#configuration) for more detail.

<details>
  <summary><code>expensive -I</code></summary>
  <table>
  <tr><td>
    <img alt="Updating configuration." src="doc/init.gif" />
  </td></tr>
  </table>
</details>

<!-- Force updating of the configuration (`HOMEDIR/.expensiverc` and `HOMEDIR/.expensive-clientrc`) files. The new values will override the existing ones. -->

### Print Version

Version number can be displayed with `-v` (or `--version`).

<details>
  <summary><code>expensive -v</code></summary>
  <table>
  <tr><td>
    <img alt="Viewing the version." src="doc/version.gif" />
  </td></tr>
  </table>
</details>

### Display Usage

Prints the help information.

<details>
  <summary><code>expensive -h</code></summary>
  <table>
  <tr><td>
    <img alt="Displaying the usage." src="doc/usage.gif" />
  </td></tr>
  </table>
</details>


## API
<!--
The package also supports a Node.js API. The authentication is completed in the same way as the CLI, that is by reading the `.expensiverc` file or presenting questions. If `global` parameter is not set to true, and the `packageName` is not given, the function will throw. You must provide either a `packageName` or set `global` to true so that the `~/.expensiverc` can be read. N-O-N-E-T-H-E-L-E-S-S it is a good idea to provide a `packageName` so that a personal config in form of `.${packageName}-expensiverc` is generated. -->

On top of the CLI application, the package provides means to query _namecheap_ API. To start using the API, a configuration can be read from a `.rc` file using `getConfig` method and passed to a client instance.

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

### new Namecheap(Auth: Object)

To be able to make requests, an instance of the `Namecheap` class needs to be created by passing an Auth object to it.

```js
/* example/simple.js */
/* yarn example/ */
import Namecheap, { getConfig } from 'expensive'

(async () => {
  try {
    // use `.expensive-example.rc` file
    // pass `global` to read `.expensiverc` instead
    const Auth = await getConfig({ packageName: 'example' })

    const nc = new Namecheap(Auth)
    const check = await nc.domains.check({ domains })
    console.log(check)
  } catch ({ stack, message }) {
    DEBUG ? LOG(stack) : console.error(message)
    process.exit(1)
  }
})()
```

### domains

#### check

#### getList

#### getInfo

## Security

When white-listing the IP addresses via the Chrome automation script, `expensive` will use the username stored in the config file, and ask for the password. The password is not stored anywhere apart from the program's memory and then used for authorisation on the `namecheap.com` website, and as the confirmation password when adding a new white-listed IP address.

You can install the package from github after you're happy with the source code, using the following command:

```sh
npm i -g artdecocode/expensive#v1.2.0
```

This will fetch the package from GitHub, and not registry. If it was possible to see the git sha sum of the commit in `yarn info package` then it would not have been necessary, because one can compare source code against the commit number. By installing from GitHub directly, one can know what they install.

<!-- You should inspect the source code of this package and possibly install from the source code and not npm with the following command.

```sh
npm i -g artdecocode/expensive#v1.1.0
``` -->

## Errors and Troubleshooting

`expensive` will display an error text when an error happens during its execution.

### `getaddrinfo ENOTFOUND api.namecheap.com api.namecheap.com:443`

This error means that there's no internet access.

Check that the computer is connected to the internet.

---

(c) [Art Deco Code][1] 2018

[1]: https://artdeco.bz
[2]: https://appshot.io
