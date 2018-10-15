const { c, b } = require('erte');
let NameCheapWeb = require('@rqt/namecheap-web'); if (NameCheapWeb && NameCheapWeb.__esModule) NameCheapWeb = NameCheapWeb.default;
const { confirm } = require('reloquent');
let t = require('tablature'); if (t && t.__esModule) t = t.default;
const { debuglog, inspect } = require('util');
let frame = require('frame-of-mind'); if (frame && frame.__esModule) frame = frame.default;

const LOG = debuglog('expensive')
const LOG_OBJ = (obj) => {
  const i = inspect(obj, { colors: true })
  LOG(i)
}

/**
 * Find a default address ID.
 * @param {Address[]} addresses A list of addresses.
 * @returns {number} A default address ID.
 */
       const findDefault = (addresses) => {
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

/** @type {import('@rqt/namecheap/build/api').Pricing} */
const findProduct = (pricing, zone, years) => {
  return pricing.domains
    .register[zone].find(({ Duration }) => Duration == years)
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
  let CouponlessPrice
  if (promoCode) {
    const cp = await nc.users.getPricing({
      type: 'DOMAIN',
      action: 'REGISTER',
      product: zone,
    });
    ({ YourPrice: CouponlessPrice } = findProduct(cp, zone, years))
  }
  const price = findProduct(pp, zone, years)
  // LOG_OBJ(price)
  return {
    PromoCode: promoCode,
    AdditionalCost: price.YourAdditonalCost,
    Price: price.YourPrice,
    PriceType: price.YourPriceType,
    AdditionalCostType: price.YourAdditonalCostType,
    Currency: price.Currency,
    CouponlessPrice: CouponlessPrice,
  }
}

const getPriceWithCurrency = (currency, price) => {
  return `${price} ${currency}`
}

const findAndApplyPromo = async (promo, sandbox, zone) => {
  if (promo) {
    console.log('Using promo %s', promo)
    return promo
  }
  if (['com', 'net', 'org', 'info', 'biz'].includes(zone)) {
    try {
      const coupon = await loading(
        'Checking coupon online',
        getCoupon(sandbox),
      )
      const co = await confirm(`\rApply coupon ${coupon}?`)
      if (co) return coupon
    } catch (e) {
      console.log('Could not retrieve promo')
    }
  }
}

const confirmPremiumPrice = async ({ IsPremiumName, PremiumRegistrationPrice, EapFee }) => {
  let res = true
  if (IsPremiumName) {
    res = await confirm(`Continue with the premium registration price of ${PremiumRegistrationPrice}?`, {
      defaultYes: false,
    })
  }
  if (parseFloat(EapFee)) {
    res = res && await confirm(`Continue with the early access fee of ${EapFee}?`, {
      defaultYes: false,
    })
  }
  if (!res) throw new Error('No confirmation.')
}

const skipPrice = (Price) => {
  return Price.map((p) => {
    return {
      ...p,
      value: `SKIP-${p.value}`,
    }
  })
}

const getFixed = n => Number(n).toFixed(2)

const loading = async (text, promise) => {
  const p = typeof promise == 'function' ? promise() : promise
  let i = 1
  const getText = () => `${text}${'.'.repeat(i)}`
  const clear = () => process.stdout.write(`\r${' '.repeat(text.length + 3)}\r`)
  let s = getText()
  process.stdout.write(s)
  const int = setInterval(() => {
    i = (i + 1) % 4
    s = getText()
    clear()
    process.stdout.write(s)
  }, 250)
  const res = await p
  clearInterval(int)
  clear()
  return res
}

const getTable = async (info, { nc, years, promo, zone }) => {
  const { IcannFee, PremiumRenewalPrice, PremiumTransferPrice, PremiumRegistrationPrice, IsPremiumName, EapFee } = info
  const Your = await getPrice(nc, zone, years, promo)

  const Premium = [
    { name: 'Premium Registration Price', value: PremiumRegistrationPrice,
      cost: PremiumRegistrationPrice,
    },
    ...skipPrice([
      { name: 'Premium Renewal Price', value: PremiumRenewalPrice },
      { name: 'Premium Transfer Price', value: PremiumTransferPrice },
    ]),
  ]
  const hasEap = parseFloat(EapFee) != 0
  const Eap = [{ name: 'Eap Fee', value: EapFee, cost: EapFee }]
  const CoolStoryBro = [
    ...(IsPremiumName ? Premium : []),
    ...(hasEap ? Eap : []),
  ]
  const Price = [
    { name: 'Price', value: Your.Price, cost: Your.Price },
    ...skipPrice(Your.PromoCode ? [{ name: 'Without Promo', value: Your.CouponlessPrice }] : []),
    ...(IcannFee ? [{ name: 'Icann Fee', value: IcannFee }] : []),
    { name: 'Additional Cost', value: `${Your.AdditionalCost}`, cost: Your.AdditionalCost },
  ]
  const hasCoolStory = CoolStoryBro.length
  const Data = hasCoolStory ? [...CoolStoryBro, ...skipPrice(Price)] : Price

  const total = (hasCoolStory ? CoolStoryBro : Price).reduce((acc, { cost = 0 }) => {
    const f = parseFloat(cost)
    return acc + f
  }, 0)
  const totalPrice = getPriceWithCurrency(Your.Currency, getFixed(total))
  const Total = [
    { name: '-----', value: '-'.repeat(totalPrice.length) },
    { name: 'Total', value: totalPrice },
  ]
  const table = t({
    keys: ['name', 'value'],
    data: [...Data, ...Total],
    headings: ['Price', 'Value'],
    replacements: {
      value(value) {
        const [, val] = `${value}`.split('SKIP-')
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
  return { Your, table }
}

const warnExtraPromo = (Your) => {
  if (Your.PromoCode && parseFloat(Your.Price) > parseFloat(Your.CouponlessPrice)) {
    console.log('[!] Warning: you will pay more with coupon %s than without it.', Your.PromoCode)
  }
}

/**
 * @param {import('@rqt/namecheap')} nc
 */
               async function register(nc, {
  domain,
  promo,
  sandbox,
  years = 1,
}) {
  const INFO = (await nc.domains.check(domain))[0]
  const { Available, EapFee, PremiumRegistrationPrice, Domain, IsPremiumName,
  } = INFO
  // LOG_OBJ(INFO)

  if (!Available) throw new Error(`Domain ${Domain} is not available.`)
  const zone = getZone(domain)

  const PROMO = await findAndApplyPromo(promo, sandbox, zone)

  const { Your, table } = await loading('Getting price', getTable(INFO, {
    nc,
    promo: PROMO,
    years,
    zone,
  }))
  console.log('\n', table)
  warnExtraPromo(Your)
  console.log('')

  if (IsPremiumName) {
    await confirmPremiumPrice({
      IsPremiumName,
      PremiumRegistrationPrice,
      EapFee,
    })
  }

  const address = await loading('Finding default address', async () => {
    const addresses = await nc.address.getList()
    const id = findDefault(addresses)
    const a = await nc.address.getInfo(id)
    return a
  })

  console.log(
    '\rRegistering %s using:',
    b(domain, 'green'),
  )
  printAddress(address)
  // default no to prevent accidental enter when waiting for address promise
  const ok = await confirm('OK?', { defaultYes: false })
  if (!ok) return
  let ChargedAmount
  try {
    ({ ChargedAmount } = await nc.domains.create({
      domain,
      address,
      promo: PROMO,
      premium: IsPremiumName ? {
        IsPremiumDomain: true,
        PremiumPrice: parseFloat(PremiumRegistrationPrice),
        EapFee: parseFloat(EapFee),
      } : {},
    }))
  } catch (err) {
    const { props = {}, message } = err
    const { Number: N } = props
    // console.log(require('util').inspect({ Number: N, message }, { colors: true }))

    if (N == 2515610) {
      console.warn('[!] Bug: cannot register a premium with Eap.')
      console.warn(' -  Response when requesting w/out EapFee:')
      console.log('    %s', message)
    } else if (N == 3028166) {
      console.warn('[!] Possible Bug (e.g., after sending without Eap)')
      console.log('    %s', message)
    }

    throw err
  }

  console.log(
    'Successfully registered %s! Charged amount: $%s.',
    c(domain, 'green'),
    getFixed(ChargedAmount),
  )
}

const printAddress = ({
  FirstName, LastName, Address1, Address2, City, Zip, Country, EmailAddress,
}) => {
  const s = `${FirstName} ${LastName}, ${EmailAddress}
 ${Address1}${Address2 ? `\n ${Address2}` : ''}
 ${City}
 ${Zip}, ${Country}`
  const f = frame(s)
  console.log(f)
}

module.exports = register
module.exports.findDefault = findDefault