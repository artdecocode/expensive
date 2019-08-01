import NameCheapWeb from '@rqt/namecheap-web'

export default async function coupon(sandbox) {
  const res = await (sandbox ? NameCheapWeb['SANDBOX_COUPON']() : NameCheapWeb['COUPON']())
  console.log(res)
}