## check: single (free)
expensive-test-random123.com

/* stdout */
Checking domain expensive-test-random123.com
Domain                        Available
expensive-test-random123.com     yes
/**/

## check: single (taken)
expensive-test-info.bz

/* stdout */
Checking domain expensive-test-info.bz
Domain                  Available
expensive-test-info.bz     no
/**/

## check: zones
expensive-test-info -z bz,com

/* stdout */
Checking domains expensive-test-info.com, expensive-test-info.bz
Domain                   Available
expensive-test-info.com     yes
expensive-test-info.bz      no
/**/

## check: free
expensive-test-info -z bz,com -f

/* stdout */
Checking domains expensive-test-info.com, expensive-test-info.bz
Domain                   Available
expensive-test-info.com     yes
/**/

## check: multiple
test

/* stdout */
Checking domains test.com, test.net, test.org, test.biz, test.co, test.cc, test.io, test.bz, test.nu, test.app, test.page
Domain     Available
test.com      no
test.co       no
test.net      no
test.org      no
test.cc       no
test.io       no
test.bz       no
test.app      yes
test.page     no
test.biz      no
test.nu       no
/**/

## --info
expensive-test-info.bz --info

/* stdout */
Created:        10/06/2018
Expires on:     10/07/2019
Whois enabled:  True
Whois email:    zoidberg@futurama.bz
DNS:            FREE
Nameservers:    dns1.registrar-servers.com, dns2.registrar-servers.com
Created:        10/06/2018
/**/

## -i
expensive-test-info.bz -i

/* stdout */
Created:        10/06/2018
Expires on:     10/07/2019
Whois enabled:  True
Whois email:    zoidberg@futurama.bz
DNS:            FREE
Nameservers:    dns1.registrar-servers.com, dns2.registrar-servers.com
Created:        10/06/2018
/**/