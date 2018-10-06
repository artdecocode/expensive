## CLI

The program can be used from the terminal.

```sh
expensive -h
```

%FORK-fs src/bin -h%

%TABLE-MACRO commands
[`$1`](#$2), $3
%

```table commands
[
  ["Command", "Meaning"],
  ["example ex.com", "check-availability", "Check domain availability."],
  ["desired.com -w", "whois", "Request WHOIS data."],
  [
    "ex.com -i",
    "show-domain-information",
    "Display information about a domain associated with the account."
  ],
  ["create.com -r", "register-domain", "Register a domain name."],
  ["--init", "initialiseupdate-settings", "Initialises or updates settings such as API key."],
  ["--version", "print-version", "Print version."],
  ["--help", "display-usage", "Show help."]
]
```

%~ width="15"%