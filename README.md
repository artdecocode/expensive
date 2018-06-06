# expensive

```sh
npm i -g expensive
```

`expensive` is a Namecheap.com API client to register and manage domains from CLI.

## Settings Initialisation

Upon the first run the program will ask a series of questions:

```
username: namecheap-username
api key https://ap.www.namecheap.com/settings/tools/apiaccess/: api key accessed at the given page
client ip https://www.google.co.uk/search?q=my+ip: the ip
```

After they've been answered, the program will remember the answers and store them in `.expensiverc` file the the home directory, and use this data for all subsequent calls to the API.

## `CLI`

The usage is as follows:

```fs
  expensive
    domain                  check a domain name in various startupy zones
                            (.io, .cc, .co, .bz, .app)
    domain.com              check a domain name
    domain1.com domain2.com check multiple domain names
```

```js
const expensive = require('expensive')

expensive()
```

---

(c) [artdecocode][1] 2018

[1]: https://artdeco.bz
