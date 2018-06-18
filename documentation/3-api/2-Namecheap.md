
### `new Namecheap(Auth: Object)`

To be able to make requests, an instance of the `Namecheap` class needs to be created by passing an Auth object to it.

```js
/* example/simple.js */
/* yarn example/ */
import Namecheap, { getConfig } from 'expensive'

(async () => {
  try {
    // use `.expensive-example.rc` file
    // pass `global` to read `.expensiverc` instead
    const Auth = await getConfig({ packageName: 'example' })

    const nc = new Namecheap(Auth)
    const check = await nc.domains.check({ domains })
    console.log(check)
  } catch ({ stack, message }) {
    DEBUG ? LOG(stack) : console.error(message)
    process.exit(1)
  }
})()
```
