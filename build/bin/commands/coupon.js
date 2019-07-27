let NameCheapWeb = require('@rqt/namecheap-web'); if (NameCheapWeb && NameCheapWeb.__esModule) NameCheapWeb = NameCheapWeb.default;

async function coupon(sandbox) {
  const res = await (sandbox ? NameCheapWeb.SANDBOX_COUPON() : NameCheapWeb.COUPON())
  console.log(res)
}

module.exports = coupon