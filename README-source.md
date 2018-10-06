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


<!-- ### Set DNS

To or assign DNS values for a given domain, the `-d` (or `--dns`) command can be used. All items should be separated with a comma.

<details>
  <summary><code>expensive example.co -d 10.10.10.10,11.11.11.11</code></summary>
  <table>
  <tr><td>
    <img alt="Assigning new DNS values." src="doc/dns.gif" />
  </td></tr>
  </table>
</details> -->

<!-- ### Set Route 53

To automatically create a new hosted zone on `Route 53`, and assign its nameservers to the domain, the `-r53` option can be passed.

<details>
  <summary><code>expensive example.co -r53</code></summary>
  <table>
  <tr><td>
    <img alt="Creating and assigning a route 53 zone." src="doc/route-53.gif" />
  </td></tr>
  </table>
</details> -->

<!-- You should inspect the source code of this package and possibly install from the source code and not npm with the following command.

```sh
npm i -g artdecocode/expensive#v1.1.0
``` -->
