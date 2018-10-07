// can check a single domain
test.org

/* expected */
Checking domain test.org
Domain    Available
test.org     no
/**/

// can check multiple domains
test

/* expected */
Checking domains test.com, test.net, test.org, test.biz, test.co, test.cc, test.io, test.bz, test.nu, test.app
Domain    Available
test.com     no
test.net     no
test.org     no
test.biz     no
test.co      no
test.cc      no
test.io      no
test.bz      no
test.nu      no
test.app     yes
/**/