import { c, b } from 'erte'
import NameCheapWeb from '@rqt/namecheap-web'
import { confirm } from 'reloquent'
import t from 'tablature'

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
const getPrice = async (nc, zone, years, promoCode, PremiumRegistrationPrice, EapFee) => {
  const pp = await nc.users.getPricing({
    type: 'DOMAIN',
    promoCode,
    action: 'REGISTER',
    product: zone,
  })
  const price = pp.domains.register[zone].find(({ Duration }) => Duration == years)
  const PC = getPriceWithCurrency.bind(null, price.Currency)
  let p = price.YourPrice != price.RegularPrice
    ? `${c(PC(price.YourPrice), 'green')} (regular ${price.RegularPrice})`
    : PC(price.RegularPrice)
  p = price.YourAdditonalCost
    ? `${p} + ${PC(price.YourAdditonalCost)} fee`
    : p
  p += PremiumRegistrationPrice ? `, premium registration ${PC(PremiumRegistrationPrice)}` : ''
  p += EapFee ? `, eapFee ${PC(EapFee)}` : ''
  return { Your: {
    AdditionalCost: price.YourAdditonalCost,
    Price: price.YourPrice,
    PriceType: price.YourPriceType,
    AdditionalCostType: price.YourAdditonalCostType,
  }, p }
}

const getPriceWithCurrency = (currency, price) => {
  return `${price} ${currency}`
}

const findAndApplyPromo = async (promo, sandbox, zone) => {
  if (promo) {
    console.log('Using promo %s', promo)
    return promo
  }
  if (/\.(com|net|org|info|biz$)/.test(zone)) {
    console.log('Checking coupon online')
    try {
      const coupon = await getCoupon(sandbox)
      const co = await confirm(`Apply coupon ${coupon}?`)
      if (co) return coupon
    } catch (e) { /**/ }
  }
}

const confirmPremiumPrice = async ({ IsPremiumName, PremiumRegistrationPrice, EapFee }) => {
  if (!IsPremiumName) return
  const res = await confirm(`Continue with the premium registration price of ${PremiumRegistrationPrice} and ${EapFee} EapFee?`, {
    defaultYes: false,
  })
  if (!res) throw new Error('No confirmation.')
}

const getTable = async (info, { nc, years, promo, zone }) => {
  const { IcannFee, PremiumRenewalPrice, PremiumTransferPrice, PremiumRegistrationPrice, IsPremiumName, EapFee } = info
  const { Your } = await getPrice(nc, zone, years, promo, PremiumRegistrationPrice, EapFee)

  const Premium = IsPremiumName ? [
    { name: 'Premium Registration Price', value: PremiumRegistrationPrice, cost: PremiumRegistrationPrice },
    { name: 'Premium Renewal Price', value: `SKIP-${PremiumRenewalPrice}` },
    { name: 'Premium Transfer Price', value: `SKIP-${PremiumTransferPrice}` },
    { name: 'Eap Fee', value: EapFee, cost: EapFee },
  ] : []
  const Price = [
    { name: 'Price', value: Your.Price, cost: Your.Price },
    { name: 'Icann Fee', value: IcannFee }, // in additional cost
    { name: 'Additional Cost', value: Your.AdditionalCost, cost: Your.AdditionalCost },
  ]
  const Data = [...Premium, ...(IsPremiumName ? Price.map((p) => {
    return {
      ...p,
      value: `SKIP-${p.value}`,
    }
  }) : Price)]
  const total = (IsPremiumName ? Premium : Price).reduce((acc, { cost = 0 }) => {
    const f = parseFloat(cost)
    return acc + f
  }, 0)
  const Total = [
    { name: '----', value: '-----' },
    { name: 'Total', value: `${Math.round(total * 100000) / 100000}` },
  ]
  const tt = t({
    keys: ['name', 'value'],
    data: [...Data, ...Total],
    headings: ['Price', 'Value'],
    replacements: {
      value(value) {
        const [, val] = value.split('SKIP-')
        if (val) {
          return {
            value: c(val, 'grey'),
            length: val.length,
          }
        }
        return { value, length: value.length }
      },
    },
  })
  return tt
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
  const INFO = (await nc.domains.check(domain))[0]
  const { Available, EapFee, PremiumRegistrationPrice, Domain, IsPremiumName,
  } = INFO

  if (!Available) throw new Error(`Domain ${Domain} is not available.`)
  const zone = getZone(domain)
  const table = await getTable(INFO, {
    nc,
    promo,
    years,
    zone,
  }); console.log(table)

  if (IsPremiumName) {
    await confirmPremiumPrice({
      IsPremiumName,
      PremiumRegistrationPrice,
      EapFee,
    })
  }

  const PROMO = await findAndApplyPromo(promo, sandbox, zone)

  const addresses = await nc.address.getList()
  const id = findDefault(addresses)
  const address = await nc.address.getInfo(id)
  console.log(
    'Registering %s using:',
    b(domain, 'green'),
  )
  printAddress(address)
  const ok = await confirm('OK?')
  if (!ok) return
  const { ChargedAmount } = await nc.domains.create({
    domain,
    address,
    promo: PROMO,
    premium: IsPremiumName ? {
      IsPremiumDomain: true,
      PremiumPrice: parseFloat(PremiumRegistrationPrice),
      EapFee: parseFloat(EapFee),
    } : undefined,
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