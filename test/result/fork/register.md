// can register a domain
com

/* inputs */
Apply coupon: n
OK: y
/**/

/* expected */
Apply coupon ZOMBIETLD (y/n)? [y] n

Price            8.88
Additional Cost  0.18
-----            --------
Total            9.06 USD

Registering DOMAIN using:
┌─────────────────────────────────────┐
│ John Zoidberg, zoidberg@futurama.bz │
│  Planet Express                     │
│  57th Street                        │
│  New New York                       │
│  10019, US                          │
└─────────────────────────────────────┘
OK (y/n)? [n] y
Successfully registered DOMAIN! Charged amount: $9.06.
/**/

// can cancel registering a domain
com

/* inputs */
Apply coupon: n
OK: n
/**/

/* expected */
Apply coupon ZOMBIETLD (y/n)? [y] n

Price            8.88
Additional Cost  0.18
-----            --------
Total            9.06 USD

Registering DOMAIN using:
┌─────────────────────────────────────┐
│ John Zoidberg, zoidberg@futurama.bz │
│  Planet Express                     │
│  57th Street                        │
│  New New York                       │
│  10019, US                          │
└─────────────────────────────────────┘
OK (y/n)? [n] n
/**/

// can apply coupon
com

/* inputs */
Apply coupon: y
OK: n
/**/

/* expected */
Apply coupon ZOMBIETLD (y/n)? [y] y

Price            9.95
Without Promo    8.88
Additional Cost  0.18
-----            ---------
Total            10.13 USD
[!] Warning: you will pay more with coupon ZOMBIETLD than without it.

Registering DOMAIN using:
┌─────────────────────────────────────┐
│ John Zoidberg, zoidberg@futurama.bz │
│  Planet Express                     │
│  57th Street                        │
│  New New York                       │
│  10019, US                          │
└─────────────────────────────────────┘
OK (y/n)? [n] n
/**/