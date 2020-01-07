_Unsetting the record is performed in the same way, but by adding the `-d` option:_

```console
wiki:~$ expensive expensive-demo.com --record AAAA --address 10.10.10.10 --ttl 3600 -d
```

<fork lang="js">
  <answer regex="Are you sure you want to">y</answer>
  src/bin expensive-demo.com --record AAAA --address 10.10.10.10 --ttl 3600 --host www --delete
</fork>