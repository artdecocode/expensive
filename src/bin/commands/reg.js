import { c, b } from 'erte'
import NameCheapWeb from '@rqt/namecheap-web'
import { askSingle } from 'reloquent'

/**
 * Find a default address ID.
 * @param {Address[]} addresses A list of addresses.
 * @returns {number} A default address ID.
 */
export const findDefault = (addresses) => {
  const { AddressId } = addresses.find(({ IsDefault }) => IsDefault) || {}
  return AddressId
}

const getCoupon = async (sandbox) => {
  const coupon = await (sandbox ? NameCheapWeb.SANDBOX_COUPON() : NameCheapWeb.COUPON())
  return coupon
}

const getZone = (domain) => {
  const z  = domain.split('.')
  const zone = z[z.length - 1]
  return zone
}

/**
 * @param {import('@rqt/namecheap')} nc
 */
const getPrice = async (nc, zone, years, promoCode) => {
  const pp = await nc.users.getPricing({
    type: 'DOMAIN',
    promoCode,
    action: 'REGISTER',
    product: zone,
  })
  const price = pp.domains.register[zone].find(({ Duration }) => Duration == years)
  let p = price.YourPrice != price.RegularPrice
    ? `${c(getPriceWithCurrency(price.YourPrice, price.Currency), 'green')} (regular ${price.RegularPrice})`
    : getPriceWithCurrency(price.RegularPrice, price.Currency)
  p = price.YourAdditonalCost
    ? `${p} + ${getPriceWithCurrency(price.YourAdditonalCost, price.Currency)} fee`
    : p
  return p
}

const getPriceWithCurrency = (price, currency) => {
  return `${price} ${currency}`
}

/**
 * @param {import('@rqt/namecheap')} nc
 */
export default async function register(nc, {
  domain,
  promo,
  sandbox,
  years = 1,
}) {
  let p = promo
  const zone = getZone(domain)
  if (!promo && /\.(com|net|org|info|biz$)/.test(domain)) {
    try {
      const coupon = await getCoupon(sandbox)
      const cy = await askSingle({
        text: `Apply coupon ${coupon} (y/n)?`,
        defaultValue: 'y',
      })
      if (cy == 'y') p = coupon
    } catch (e) { /**/ }
  }

  const pr = await getPrice(nc, zone, years, p)

  const addresses = await nc.address.getList()
  const id = findDefault(addresses)
  const address = await nc.address.getInfo(id)
  console.log('Registering %s\nfor %s\nusing:', b(domain, 'green'), pr)
  printAddress(address)
  const y = await askSingle({
    text: 'OK (y/n)?',
    defaultValue: 'y',
  })
  if (y != 'y') return
  const { ChargedAmount } = await nc.domains.create({
    domain,
    address,
    promo: p,
  })
  console.log(
    'Successfully registered %s! Charged amount: $%s.',
    c(domain, 'green'),
    ChargedAmount,
  )
}

const printAddress = ({
  FirstName, LastName, Address1, Address2, City, Zip, Country, EmailAddress,
}) => {
  console.log(' %s %s, %s', FirstName, LastName, EmailAddress)
  console.log(' %s', Address1)
  Address2 && console.log(' %s', Address2)
  console.log(' %s', City)
  console.log(' %s, %s', Zip, Country)
}