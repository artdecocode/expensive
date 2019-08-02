_Expensive_ can set and unset DNS host records when using _Namecheap_ DNS service. This is ideal for dev-ops engineers native to CLI environment who want to avoid having to click through the web-interface.

## On This Page

%TOC%

%~%

## Arguments

This is the list of all possible arguments which can be used to manipulate DNS hosts.

<argufy>types/args/dns.xml</argufy>

%~%

## Creating TXT Record

To create a TXT record, there's the `TXT` alias, which set the type _TXT_ and address equal to the value of the passed argument.

```sh
expensive expensive-demo.com --TXT github-wiki
```

<fork lang="js">
  src/bin expensive-demo.com --TXT github-wiki
</fork>

%~%
<!-- ```
expensive expensive-demo.com --TXT github-wiki
```

%FORK src/bin expensive-demo.com --TXT github-wiki --delete%

```
expensive expensive-demo.com --record A --address 10.10.10.10
```

%FORK src/bin expensive-demo.com --record A --address 10.10.10.10% -->