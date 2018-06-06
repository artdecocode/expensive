"use strict";

var _ = require("..");

const [,,, domain = 'google.com'] = process.argv;

(async () => {
  const a = await (0, _.auth)({
    global: true
  });
  const res = await (0, _.checkDomains)({ ...a,
    domain
  });
  console.log(res);
})();
//# sourceMappingURL=index.js.map