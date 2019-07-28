const NameCheapWeb = require('@rqt/namecheap-web');

async function coupon(sandbox) {
  const res = await (sandbox ? NameCheapWeb.SANDBOX_COUPON() : NameCheapWeb.COUPON())
  console.log(res)
}

module.exports = coupon