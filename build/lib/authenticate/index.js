"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _util = require("util");

var _assert = require("assert");

var _chromeRemoteInterface = _interopRequireDefault(require("chrome-remote-interface"));

var _chrome = _interopRequireDefault(require("chrome-remote-interface/lib/chrome"));

var _reloquent = require("reloquent");

var _lib = require("./lib");

var _fs = require("fs");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-console */
// eslint-disable-line no-unused-vars
const LOG = (0, _util.debuglog)('expensive');
const url = 'https://ap.www.namecheap.com/settings/tools/apiaccess/whitelisted-ips';

const authenticate = async ({
  user,
  password,
  ip,
  // ip to set
  phone,
  chrome
}) => {
  const {
    port
  } = chrome;
  LOG('Chrome debugging port running on %s', port);
  /** @type {Chrome} */

  let client;
  let res;
  let Page;

  try {
    client = await (0, _chromeRemoteInterface.default)({
      port
    });
    const {
      Network,
      DOM,
      Runtime,
      Input
    } = client;
    ({
      Page
    } = client);
    Network.requestIntercepted(({
      interceptionId,
      request
    }) => {
      const blocked = (0, _lib.isBlocked)(request.url);

      if (!blocked) {
        LOG(request.url);
      }

      Network.continueInterceptedRequest({
        interceptionId,
        errorReason: blocked ? 'Aborted' : undefined
      });
    }); // enable events then start!

    await Network.enable();
    await Page.enable();
    await DOM.enable();
    await Runtime.enable();
    await Network.setRequestInterception({
      patterns: [{
        urlPattern: '*'
      }]
    }); // await Network.setCacheDisabled({ cacheDisabled: true })

    await Page.navigate({
      url: `https://www.namecheap.com/myaccount/login-signup.aspx?ReturnUrl=${encodeURIComponent(url)}`
    });
    await Page.loadEventFired();
    await login(Runtime, {
      user,
      password
    });
    await Page.loadEventFired();
    await (0, _lib.checkAuth)(Runtime);
    await selectPhone(Runtime, phone);
    await Page.loadEventFired();
    await enterCode(Runtime);
    await Page.loadEventFired();
    const a = await (0, _lib.evaluate)(Runtime, 'location.href');
    (0, _assert.equal)(a, url, `Unexpected url: ${a}`);
    await addIpAddress(Runtime, Input, {
      ip,
      password
    });
    res = true;
  } catch (err) {
    LOG(err);
    res = err.message;
  } finally {
    if (client) {
      // const { data } = await Page.captureScreenshot()
      // writeFileSync('debug.png', Buffer.from(data, 'base64'))
      await client.close();
    }
  }

  await chrome.kill();
  console.log('Chrome killed');
  return res;
};

const fetchNewIp = async (Runtime, {
  name,
  csrf,
  password: accountPassword,
  ip: ipAddress
}) => {
  const data = {
    accountPassword,
    name,
    ipAddress
  };
  const j = JSON.stringify(data);
  const url = 'https://ap.www.namecheap.com/api/v1/ncpl/apiaccess/ui/AddIpAddress';
  const {
    result,
    exceptionDetails
  } = await Runtime.evaluate({
    expression: `
      (async () => {
        const response = await fetch('${url}', {
          body: '${j}',
          cache: 'no-cache',
          credentials: 'include',
          headers: {
            'x-ncpl-rcsrf': '${csrf}',
            'content-type': 'application/json',
          },
          method: 'POST',
        })
        const contentType = response.headers.get('content-type')
        if(contentType && contentType.includes('application/json')) {
          const j = await response.json()
          return JSON.stringify(j)
        }
        throw new Error("haven't got a JSON")
      })()
`,
    awaitPromise: true
  });

  if (exceptionDetails) {
    throw new Error(exceptionDetails.exception.description);
  }

  const res = JSON.parse(result.value);

  if (res.__isError) {
    throw new Error(res.__errorType);
  }

  if (!res.Success) {
    if (!Array.isArray(res.Errors)) {
      throw new Error('The request was not successful');
    }

    const [{
      Message
    }] = res.Errors;
    throw new Error(Message);
  }
};

const addIpAddress = async (Runtime, Input, {
  ip,
  password
}) => {
  const name = `expensive ${new Date().toLocaleString()}`.replace(/:/g, '-');
  const csrf = await (0, _lib.evaluate)(Runtime, 'document.querySelector("#x-ncpl-csrfvalue").value');
  await fetchNewIp(Runtime, {
    password,
    name,
    ip,
    csrf
  }); // await new Promise(r => setTimeout(r, 1000)) // wait for
  // await focus(Runtime, '#ip-name')
  // for (let i = 0; i < name.length; i++) {
  //   await Input.dispatchKeyEvent({ type: 'char', text: name[i] })
  // }
  // await focus(Runtime, '#ip-address')
  // for (let i = 0; i < ip.length; i++) {
  //   await Input.dispatchKeyEvent({ type: 'char', text: ip[i] })
  // }
  // await evaluate(Runtime, 'document.querySelectorAll(\'input[type="password"]\')[1].focus()')
  // for (let i = 0; i < password.length; i++) {
  //   await Input.dispatchKeyEvent({ type: 'char', text: password[i] })
  // }
  // await evaluate(Runtime, 'document.querySelectorAll(\'button.gb-btn--primary\')[1].click()')
};

const login = async (Runtime, {
  user,
  password
}) => {
  await (0, _lib.setValue)(Runtime, 'input.nc_username', user);
  await (0, _lib.setValue)(Runtime, 'input.nc_password', password);
  await (0, _lib.click)(Runtime, 'input.nc_login_submit');
};

const selectPhone = async (Runtime, phone) => {
  const submitSelector = 'input[type="submit"]';
  const selectSelector = 'select.verification-method';
  /** @type {{v: string, i: string}[]} */

  const options = await (0, _lib.evaluate)(Runtime, `
  Array.from(document.querySelectorAll('${selectSelector} > option'))
    .map(p => ({v: p.value, i: p.innerHTML }))`, true);

  if (phone) {
    const option = options.find(({
      i
    }) => i.endsWith(phone));
    if (!option) throw new Error(`A phone number ending with ${phone} cannot be found. Added numbers: ${options.map(({
      i
    }) => i).join(', ')}`);
    await (0, _lib.evaluate)(Runtime, `document.querySelector('${selectSelector}').value = "${option.v}"`);
    await (0, _lib.evaluate)(Runtime, `document.querySelector('${submitSelector}').click()`);
    return;
  }

  const keys = options.map(({
    i
  }) => i.slice(i.length - 3));

  if (options.length) {
    const text = `Which phone number to use for 2 factor auth
${options.map(({
      i
    }) => ` ${i}`).map(_lib.mapPhoneOptions).join('\n')}
enter last 3 digits`;
    const answer = await (0, _reloquent.askSingle)({
      text,

      async getDefault() {
        return phone || keys[0];
      },

      validation(a) {
        const p = options.some(({
          i
        }) => i.endsWith(a));

        if (!p) {
          throw new Error('unknown number entered');
        }
      }

    });
    console.log(answer);
    const {
      v
    } = options.find(({
      i
    }) => i.endsWith(answer));
    await Runtime.evaluate({
      expression: `document.querySelector('select.verification-method').value = "${v}"`
    });
  }

  await Runtime.evaluate({
    expression: `document.querySelector('input[type="submit"]').click()` // eslint-disable-line

  });
};

const enterCode = async Runtime => {
  const val = await (0, _lib.getValue)(Runtime, 'input[type="submit"]');
  (0, _assert.equal)(val, 'Submit Security Code', 'Did not get to the page with verification of security code');
  /** @type {string} */

  const info = await Runtime.evaluate({
    expression: `document.querySelector('.info').innerText` // eslint-disable-line

  });
  const r = /Your \d-digit code begins with (\d)/.exec(info.result.value);

  if (!r) {
    await (0, _lib.checkLimit)(Runtime);
    throw new Error('Could not enter the code'); // return
  }

  const [, b] = r;
  const code = await (0, _reloquent.askSingle)({
    text: `Security code (begins with ${b})`
  });
  await (0, _lib.setValue)(Runtime, 'input[placeholder="Verification Code"]', code);
  await (0, _lib.click)(Runtime, 'input[type="submit"]');
};

var _default = authenticate;
exports.default = _default;
//# sourceMappingURL=index.js.map