### Check Availability

To start a domain check in multiple zones, enter a word without a domain. Multiple words can be entered as well to check all of them. Maximum of 50 domains per request is allowed.

```sh
expensive domain[ domain2 ...domainN] [-f] [-z com,co,etc]
```

```table
[
  ["arg", "description"],
  ["-f, --free", "Display only free domains in the output."],
  ["-z, --zones", "A list of zones to check. Defaults to `com`, `net`, `org`, `biz`, `co`, `cc`, `io`, `bz`, `nu` and `app`."]
]
```

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
<br/>

To check a single domain, pass the domain name, e.g.,

<details>
  <summary><code>expensive testt.co</code></summary>
  <table>
  <tr><td>
    <img alt="Checking a single domain." src="doc/single.gif" />
  </td></tr>
  </table>
</details>

%~ width="15"%