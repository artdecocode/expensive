## Example

_The example shows how to set the `AAAA` record with a given TTL for the `www` subdomain (host):_

```console
wiki:~$ expensive expensive-demo.com --record AAAA --address 10.10.10.10 --ttl 3600 --host www
```

<fork lang="js">
  src/bin expensive-demo.com --record AAAA --address 10.10.10.10 --ttl 3600 --host www
</fork>