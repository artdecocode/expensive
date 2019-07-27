## CLI

The program can be used from the terminal.

```sh
expensive -h
```

%FORK-fs src/bin -h%

%TABLE-MACRO commands
`$1`, $2, $3
%

```table commands
[
  ["Command", "Meaning", "Wiki"],
  [
    "expensive",
    "List all domains.", "<kbd>📜[List Domains](../../wiki/List%20Domains)</kbd>"
  ],
  [
    "expensive hello world example.com",
    "Check domain(s)' availability.", "<kbd>✅[Check Availability](../../wiki/Check%20Availability)</kbd>"
  ],
  [
    "expensive example.com -i",
    "Display information about a domain associated with the account.", "<kbd>ℹ️[Domain Information](../../wiki/Domain%20Information)</kbd>"
  ],
  [
    "expensive example.com -w",
    "Request WHOIS data.", "<kbd>👁[Show Whois](../../wiki/Whois)</kbd>"
  ],
  [
    "expensive example.com -r",
    "Register a domain name.", "<kbd>💵[Registration](../../wiki/Registration)</kbd>"
  ],
  [
    "expensive --init",
    "Initialises or updates settings such as API key.", "<kbd>🔏[Initialise Config](../../wiki/Initialise-Config)</kbd>"
  ],
  ["expensive --version", "Print version.", "<kbd>[Version](../../wiki/Version)</kbd>"],
  ["expensive --help", "Show help.", "<kbd>[Usage](../../wiki/Usage)</kbd>"]
]
```

<!--", "<kbd>Usage</kbd><kbd>Version</kbd> -->

%~%