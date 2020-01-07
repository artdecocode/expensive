## Deleting Records

To delete a record, the `--delete` flag should be set. All other arguments must be set to match the record being deleted. If, for example, only the `--record A` is passed without the `--address`, _Expensive_ will remove all host records of type _A_.

```sh
expensive expensive-demo.com --TXT github-wiki --delete
```

<fork lang="js">
  <answer regex="Are you sure you want to">y</answer>
  src/bin expensive-demo.com --TXT github-wiki --delete
</fork>

%~%