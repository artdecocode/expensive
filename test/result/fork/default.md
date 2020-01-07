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
test.net      no
test.org      no
test.biz      no
test.co       no
test.cc       no
test.io       no
test.bz       no
test.nu       no
test.app      yes
test.page     no
/**/

## --info
expensive-test-info-1.bz --info

/* stdout */
Created:        01/07/2020
Expires on:     01/07/2021
Whois enabled:  True
Whois email:    zoidberg@futurama.bz
DNS:            FREE
Nameservers:    dns1.registrar-servers.com, dns2.registrar-servers.com
Created:        01/07/2020

Name  Type   Address
www   CNAME  parkingpage.namecheap.com.
@     URL    http://www.expensive-test-info-1.bz?from=@
/**/

## -i
expensive-test-info-1.bz -i

/* stdout */
Created:        01/07/2020
Expires on:     01/07/2021
Whois enabled:  True
Whois email:    zoidberg@futurama.bz
DNS:            FREE
Nameservers:    dns1.registrar-servers.com, dns2.registrar-servers.com
Created:        01/07/2020

Name  Type   Address
www   CNAME  parkingpage.namecheap.com.
@     URL    http://www.expensive-test-info-1.bz?from=@
/**/