[![namecheap](https://raw.githubusercontent.com/artdecocode/expensive/HEAD/images/nc.gif)](https://nameexpensive.com)

# expensive

[![npm version](https://badge.fury.io/js/expensive.svg)](https://npmjs.org/package/expensive)

`expensive` is a [namecheap.com](https://nameexpensive.com) client to check domain availability, obtain WHOIS information, register domains, update DNS hosts and control domains' name servers via the CLI. It allows to login using 2-factor authentication and white-list IP addresses without having to use the web interface. The package uses the [API](https://github.com/rqt/namecheap) and [Web API](https://github.com/rqt/namecheap-web) libraries to make requests.

| Package Manager |          Command          |
| --------------- | ------------------------- |
| Yarn            | yarn add global expensive |
| Npm             | npm i -g expensive        |

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [Configuration](#configuration)
- [Sandbox](#sandbox)
- [CLI](#cli)
  * [Check Availability](#check-availability)
  * [Whois](#whois)
  * [Show Domain Information](#show-domain-information)
  * [Register Domain](#register-domain)
  * [Initialise/Update Settings](#initialiseupdate-settings)
  * [Print Version](#print-version)
  * [Display Usage](#display-usage)
- [Result Log](#result-log)
- [Copyright](#copyright)

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/0.svg?sanitize=true"></a></p>

## Configuration

Upon the first run the program will ask a series of questions:

```fs
Username: <namecheap-username>
Api key https://ap.www.namecheap.com/settings/tools/apiaccess/: <api key>
Client ip [10.10.10.10]: <the ip>
Last 3 digit of phone to use for 2 factor auth: <055>
```

After they've been answered, `expensive` will remember the answers and store them in the `.expensiverc` file in the home directory (or `.expensive-sandboxrc`), and use this data for all calls to the API.

Client IP is required for requests, but if not given, the it will be acquired automatically each time prior to calls. The last 3 digits will be used to during the second-stage of the 2-factor web auth required to white-list unknown IP addresses.

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/1.svg?sanitize=true"></a></p>

## Sandbox

To use the `sandbox` version of the app for testing, either the `SANDBOX` environmental variable needs to be set, or `--sandbox` or `-S` flags should be passed.

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/2.svg?sanitize=true"></a></p>

## CLI

The program can be used from the terminal.

```sh
expensive -h
```

```fs
A CLI application to access namecheap.com domain name registrar API.
See man expensive for more information.

  expensive [domain.co [domain.cc]] -f -z co[,io,app] -i -IHhv

	domain        	check a domain name in a number of zones
	              	(com, net, org, biz, co, cc, io, bz, nu, app)
	domain.co     	check a domain name
	-f            	display only free domains when checking
	-z co,io      	check in these zones only
	-i, --info    	display info on domain
	-r, --register	register a domain
	-I, --init    	interactively initialise the configuration
	-h, --help    	print usage information
	-v, --version 	print package's version
```


|                 Command                 |                             Meaning                             |
| --------------------------------------- | --------------------------------------------------------------- |
| [`example ex.com`](#check-availability) | Check domain availability.                                      |
| [`desired.com -w`](#whois)              | Request WHOIS data.                                             |
| [`ex.com -i`](#show-domain-information) | Display information about a domain associated with the account. |
| [`create.com -r`](#register-domain)     | Register a domain name.                                         |
| [`--init`](#initialiseupdate-settings)  | Initialises or updates settings such as API key.                |
| [`--version`](#print-version)           | Print version.                                                  |
| [`--help`](#display-usage)              | Show help.                                                      |

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/3.svg?sanitize=true" width="15"></a></p>

### Check Availability

To start a domain check in multiple zones, enter a word without a domain. Multiple words can be entered as well to check all of them. Maximum of 50 domains per request is allowed.

```sh
expensive domain[ domain2 ...domainN] [-f] [-z com,co,etc]
```

|     arg     |                                                description                                                |
| ----------- | --------------------------------------------------------------------------------------------------------- |
| -f, --free  | Display only free domains in the output.                                                                  |
| -z, --zones | A list of zones to check. Defaults to `com`, `net`, `org`, `biz`, `co`, `cc`, `io`, `bz`, `nu` and `app`. |

<details>
  <summary><code>expensive testt</code></summary>
  <table>
  <tr><td>
    <img alt="Checking domains." src="doc/check.gif" />
  </td></tr>
  </table>
</details>

<details>
  <summary><code>expensive latest detest cutest attest retest -f -z com,co,cc,io,app</code></summary>
  <table>
  <tr><td>
    <img alt="Checking free domains in specified zones." src="doc/check-f.gif" />
  </td></tr>
  </table>
</details>


To check a single domain, pass the domain name, e.g.,

<details>
  <summary><code>expensive testt.co</code></summary>
  <table>
  <tr><td>
    <img alt="Checking a single domain." src="doc/single.gif" />
  </td></tr>
  </table>
</details>

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/4.svg?sanitize=true" width="15"></a></p>

### Whois

To request data from the WHOIS database from [`namecheap.com`](https://nameexpensive.com) website, the `--whois` or `-w` option can be used. Data will be printed in short form, with dates parsed to show the number of days passed since registration, and remaining until the domain is free.

```sh
expensive test.org -w
```

```fs
Domain Name: TEST.ORG
Registrar URL: http://www.psi-usa.info
Updated Date: 2018-7-27 04:28:31 (71 days ago)
Creation Date: 1997-7-27 08:00:00 (7741 days ago)
Registry Expiry Date: 2019-7-26 07:00:00 (in 293 days)
Name Server: NS0.TMT.DE
 NS4.TMT.DE
 NS3.TMT.DE
 NS2.TMT.DE
 NS1.TMT.DE
```

To request the extended form, the `--Whois` argument needs to be supplied.

<details>
<code>expensive test.org --Whois</code>

```fs
Domain Name: TEST.ORG
Registry Domain ID: D380528-LROR
Registrar WHOIS Server: whois.psi-usa.info
Registrar URL: http://www.psi-usa.info
Updated Date: 2018-07-27T01:28:31Z
Creation Date: 1997-07-27T04:00:00Z
Registry Expiry Date: 2019-07-26T04:00:00Z
Registrar Registration Expiration Date:
Registrar: PSI-USA, Inc. dba Domain Robot
Registrar IANA ID: 151
Registrar Abuse Contact Email: domain-abuse@psi-usa.info
Registrar Abuse Contact Phone: +49.94159559482
Reseller:
Domain Status: clientTransferProhibited https://icann.org/epp#clientTransferProhibited
Registrant Organization: TMT Teleservice GmbH &amp; Co.KG
Registrant State/Province: Bayern
Registrant Country: DE
Name Server: NS0.TMT.DE
Name Server: NS4.TMT.DE
Name Server: NS3.TMT.DE
Name Server: NS2.TMT.DE
Name Server: NS1.TMT.DE
DNSSEC: unsigned
URL of the ICANN Whois Inaccuracy Complaint Form https://www.icann.org/wicf/)
&gt;&gt;&gt; Last update of WHOIS database: 2018-10-06T01:22:28Z
```
</details>

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/5.svg?sanitize=true" width="15"></a></p>

### Show Domain Information

View the domain information associated with the account.

<details>
  <summary><code>expensive example.co -i</code></summary>
  <table>
  <tr><td>
    <img alt="Viewing information for a single domain." src="doc/info.gif" />
  </td></tr>
  </table>
</details>

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/6.svg?sanitize=true" width="15"></a></p>

### Register Domain

Domain registration from the command-line is made easy with [`expensive`](https://nameexpensive.com). Passing `-r` flag will result in acquiring the domain name. The default account address will be used for all WHOIS fields, such as `Registrant`, `Tech`, `Admin` and `AuxBilling`.

<details>
  <summary><code>expensive example.co -r</code></summary>
  <table>
  <tr><td>
    <img alt="Registering a domain name." src="doc/register.gif" />
  </td></tr>
  </table>
</details>

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/7.svg?sanitize=true" width="15"></a></p>

### Initialise/Update Settings

To update or initialise stored configuration values (e.g., on the first use, or to change an `API` key), run the `-I` or `--init` command. The [Configuration](#configuration) section explains how settings are stored in more detail.

<details>
  <summary><code>expensive --init</code></summary>
  <table>
  <tr><td>
    <img alt="Updating the stored configuration." src="doc/init.gif" />
  </td></tr>
  </table>
</details>

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/8.svg?sanitize=true" width="15"></a></p>

### Print Version

Version number can be displayed with `--version` or `-v`.

<details>
  <summary><code>expensive --version</code></summary>
  <table>
  <tr><td>
    <img alt="Viewing the version." src="doc/version.gif" />
  </td></tr>
  </table>
</details>

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/9.svg?sanitize=true" width="15"></a></p>

### Display Usage

Prints the help information with `-h` or `--help`.

<details>
  <summary><code>expensive --help</code></summary>
  <table>
  <tr><td>
    <img alt="Displaying the usage." src="doc/usage.gif" />
  </td></tr>
  </table>
</details>

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/10.svg?sanitize=true"></a></p>














## Result Log

A log of search queries and found free domains is written to `HOMEDIR/.expensive.log`.

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/11.svg?sanitize=true"></a></p>

## Copyright

(c) [Art Deco][1] 2018

[1]: https://artd.eco

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/-1.svg?sanitize=true"></a></p>