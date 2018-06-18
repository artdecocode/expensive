## CLI

The program can be used from a terminal.

```sh
expensive -h
```

```fs
A CLI application to access namecheap.com domain name registrar API.
See man expensive for more information.

  expensive [domain.co [domain.cc]] -f -z co[,io,app] -i -IHhv

        domain          check a domain name in a number of zones
                        (com, net, org, biz, co, cc, io, bz, nu, app)
        domain.co       check a domain name
        -f              display only free domains when checking
        -z co,io        check in these zones only
        -i, --info      display info on domain
        -I, --init      interactively initialise the configuration
        -h, --help      print usage information
        -v, --version   print package's version
        -H, --head      don't use headless Chrome for auth
```
