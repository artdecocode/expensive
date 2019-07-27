To start a domain check in multiple zones, enter a word without a domain. Multiple words can be entered as well to check all of them. Maximum of 50 domains per request is allowed.

```sh
expensive domain[ domain2 ...domainN] [-f] [-z com,co,etc]
```

<!-- ```table
[
  ["arg", "description"],
  ["-f, --free", "Display only free domains in the output."],
  ["-z, --zones", "A list of zones to check. Defaults to `com`, `net`, `org`, `biz`, `co`, `cc`, `io`, `bz`, `nu` and `app`."]
]
``` -->

<argufy>types/args/check.xml</argufy>

<table>
<tr/>
<tr><td>
  Checks the domain name in default 10 zones.

```sh
expensive testt
```
</td></tr>
<tr><td>
  [[check.gif|alt=Checking domains in multiple zones.]]
</td></tr>
<tr><td>
  Expensive can look up any number of domains that are passed in the command.

```sh
expensive latest detest cutest attest retest -f -z com,co,cc,io,app
```
</td></tr>
<tr><td>
  [[check-f.gif|alt=Checking free domains in specified zones.]]
</td></tr>

<tr><td>

To check a single domain, pass the domain name, e.g.,

```sh
expensive testt.co
```
</td></tr>
<tr><td>
  [[single.gif|alt=Checking a single domain.]]
</td></tr>
</table>