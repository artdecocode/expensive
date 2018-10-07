### Whois

To request data from the WHOIS database from [`namecheap.com`](https://nameexpensive.com) website, the `--whois` or `-w` option can be used. Data will be printed in short form, with dates parsed to show the number of days passed since registration, and remaining until the domain is free.

```sh
expensive test.org -w
```

%FORK-fs src/bin test.org -w%

To request the extended form, the `--Whois` argument needs to be supplied.

<details>
<summary><code>expensive test.org --Whois</code></summary>

%FORK-fs src/bin test.org --Whois%
</details>

%~ width="15"%