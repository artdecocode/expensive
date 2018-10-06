<!-- ## Security

When white-listing the IP addresses via the Chrome automation script, `expensive` will use the username stored in the config file, and ask for the password. The password is not stored anywhere apart from the program's memory and then used for authorisation on the `namecheap.com` website, and as the confirmation password when adding a new white-listed IP address.

You can install the package from github after you're happy with the source code, using the following command:

```sh
npm i -g artdecocode/expensive#v1.2.0
```

This will fetch the package from GitHub, and not registry. If it was possible to see the git sha sum of the commit in `yarn info package` then it would not have been necessary, because one can compare source code against the commit number. By installing from GitHub directly, one can know what they install. -->
