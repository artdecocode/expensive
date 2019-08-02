import { join } from 'path'

const APP_DIR = 'splendid'
const BUILD_DIR = 'docs'

/** @type {import('splendid').Config} */
const config = {
  appDir: APP_DIR,
  layout: join(APP_DIR, 'layout/main.html'),
  replacements: [
    {
      re: /{{ company }}/g,
      replacement: '[Expensive](https://expensive.page)',
    },
  ],
  output: BUILD_DIR,
  // to generate sitemaps:
  /* url: https://website.github.io/splendid */
}

export default config