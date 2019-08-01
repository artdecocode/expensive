#!/usr/bin/env node
             
const util = require('util');
const os = require('os');
const querystring = require('querystring');
const https = require('https');
const http = require('http');
const url = require('url');
const zlib = require('zlib');
const stream = require('stream');
const fs = require('fs');
const assert = require('assert');
const readline = require('readline');
const path = require('path');             
const {debuglog:q, inspect:aa} = util;
const ba = (a, b = 0, c = !1) => {
  if (0 === b && !c) {
    return a;
  }
  a = a.split("\n", c ? b + 1 : void 0);
  return c ? a[a.length - 1] : a.slice(b).join("\n");
}, ca = (a, b = !1) => ba(a, 2 + (b ? 1 : 0)), da = a => {
  ({callee:{caller:a}} = a);
  return a;
};
const {homedir:w} = os;
const ea = /\s+at.*(?:\(|\s)(.*)\)?/, fa = /^(?:(?:(?:node|(?:internal\/[\w/]*|.*node_modules\/(?:IGNORED_MODULES)\/.*)?\w+)\.js:\d+:\d+)|native)/, ha = w(), ia = a => {
  const {pretty:b = !1, ignoredModules:c = ["pirates"]} = {}, d = c.join("|"), e = new RegExp(fa.source.replace("IGNORED_MODULES", d));
  return a.replace(/\\/g, "/").split("\n").filter(f => {
    f = f.match(ea);
    if (null === f || !f[1]) {
      return !0;
    }
    f = f[1];
    return f.includes(".app/Contents/Resources/electron.asar") || f.includes(".app/Contents/Resources/default_app.asar") ? !1 : !e.test(f);
  }).filter(f => f.trim()).map(f => b ? f.replace(ea, (g, h) => g.replace(h, h.replace(ha, "~"))) : f).join("\n");
};
function ja(a, b, c = !1) {
  return function(d) {
    var e = da(arguments), {stack:f} = Error();
    const g = ba(f, 2, !0), h = (f = d instanceof Error) ? d.message : d;
    e = [`Error: ${h}`, ...null !== e && a === e || c ? [b] : [g, b]].join("\n");
    e = ia(e);
    return Object.assign(f ? d : Error(), {message:h, stack:e});
  };
}
;function y(a) {
  var {stack:b} = Error();
  const c = da(arguments);
  b = ca(b, a);
  return ja(c, b, a);
}
;const {request:ka} = https;
const {request:la} = http;
const {parse:ma} = url;
const {Writable:na} = stream;
const oa = (a, b) => {
  b.once("error", c => {
    a.emit("error", c);
  });
  return b;
};
class pa extends na {
  constructor(a) {
    const {binary:b = !1, rs:c = null, ...d} = a || {}, {i:e = y(!0), proxyError:f} = a || {}, g = (h, k) => e(k);
    super(d);
    this.b = [];
    this.B = new Promise((h, k) => {
      this.on("finish", () => {
        let l;
        b ? l = Buffer.concat(this.b) : l = this.b.join("");
        h(l);
        this.b = [];
      });
      this.once("error", l => {
        if (-1 == l.stack.indexOf("\n")) {
          g`${l}`;
        } else {
          const m = ia(l.stack);
          l.stack = m;
          f && g`${l}`;
        }
        k(l);
      });
      c && oa(this, c).pipe(this);
    });
  }
  _write(a, b, c) {
    this.b.push(a);
    c();
  }
  get j() {
    return this.B;
  }
}
const qa = async(a, b = {}) => {
  ({j:a} = new pa({rs:a, ...b, i:y(!0)}));
  return await a;
};
const {createGunzip:ua} = zlib;
const va = a => {
  ({"content-encoding":a} = a.headers);
  return "gzip" == a;
}, wa = (a, b, c = {}) => {
  const {justHeaders:d, binary:e, i:f = y(!0)} = c;
  let g, h, k, l, m = 0, n = 0;
  c = (new Promise((p, t) => {
    g = a(b, async r => {
      ({headers:h} = r);
      const {statusMessage:u, statusCode:x} = r;
      k = {statusMessage:u, statusCode:x};
      if (d) {
        r.destroy();
      } else {
        var v = va(r);
        r.on("data", H => m += H.byteLength);
        r = v ? r.pipe(ua()) : r;
        l = await qa(r, {binary:e});
        n = l.length;
      }
      p();
    }).on("error", r => {
      r = f(r);
      t(r);
    }).on("timeout", () => {
      g.abort();
    });
  })).then(() => ({body:l, headers:h, ...k, G:m, byteLength:n, w:null}));
  return {H:g, j:c};
};
const xa = (a = {}) => Object.keys(a).reduce((b, c) => {
  const d = a[c];
  c = `${encodeURIComponent(c)}=${encodeURIComponent(d)}`;
  return [...b, c];
}, []).join("&").replace(/%20/g, "+"), ya = async(a, b, {data:c, justHeaders:d, binary:e, i:f = y(!0)}) => {
  const {H:g, j:h} = wa(a, b, {justHeaders:d, binary:e, i:f});
  g.end(c);
  a = await h;
  ({"content-type":b = ""} = a.headers);
  if ((b = b.startsWith("application/json")) && a.body) {
    try {
      a.w = JSON.parse(a.body);
    } catch (k) {
      throw f = f(k), f.response = a.body, f;
    }
  }
  return a;
};
let z;
try {
  const {version:a, name:b} = require("../package.json");
  z = "@rqt/aqt" == b ? `@rqt/aqt/${a}` : `@rqt/aqt via ${b}/${a}`;
} catch (a) {
  z = "@aqt/rqt";
}
const za = q("aqt"), A = async(a, b = {}) => {
  const {data:c, type:d = "json", headers:e = {"User-Agent":`Mozilla/5.0 (Node.JS) ${z}`}, compress:f = !0, binary:g = !1, justHeaders:h = !1, method:k, timeout:l} = b;
  b = y(!0);
  const {hostname:m, protocol:n, port:p, path:t} = ma(a), r = "https:" === n ? ka : la, u = {hostname:m, port:p, path:t, headers:{...e}, timeout:l, method:k};
  if (c) {
    var x = d;
    var v = c;
    switch(x) {
      case "json":
        v = JSON.stringify(v);
        x = "application/json";
        break;
      case "form":
        v = xa(v), x = "application/x-www-form-urlencoded";
    }
    v = {data:v, contentType:x};
    ({data:x} = v);
    ({contentType:v} = v);
    u.method = k || "POST";
    "Content-Type" in u.headers || (u.headers["Content-Type"] = v);
    "Content-Length" in u.headers || (u.headers["Content-Length"] = Buffer.byteLength(x));
  }
  !f || "Accept-Encoding" in u.headers || (u.headers["Accept-Encoding"] = "gzip, deflate");
  const {body:H, headers:D, byteLength:ra, statusCode:sb, statusMessage:tb, G:sa, w:ta} = await ya(r, u, {data:x, justHeaders:h, binary:g, i:b});
  za("%s %s B%s", a, ra, `${ra != sa ? ` (raw ${sa} B)` : ""}`);
  return {body:ta ? ta : H, headers:D, statusCode:sb, statusMessage:tb};
};
const {stringify:Aa} = querystring;
function B(a, b, c) {
  const d = [];
  b.replace(a, (e, ...f) => {
    e = f.slice(0, f.length - 2).reduce((g, h, k) => {
      k = c[k];
      if (!k || void 0 === h) {
        return g;
      }
      g[k] = h;
      return g;
    }, {});
    d.push(e);
  });
  return d;
}
;const Ba = new RegExp(`${/([^\s>=/]+)/.source}(?:\\s*=\\s*${/(?:"([\s\S]*?)"|'([\s\S]*?)')/.source})?`, "g"), Ca = new RegExp(`\\s*((?:${Ba.source}\\s*)*)`);
const C = (a, b) => B(new RegExp(`<${a}${Ca.source}?(?:${/\s*\/>/.source}|${(new RegExp(`>([\\s\\S]+?)?</${a}>`)).source})`, "g"), b, ["a", "v", "v1", "v2", "c"]).map(({a:c = "", c:d = ""}) => {
  c = c.replace(/\/$/, "").trim();
  c = Da(c);
  return {content:d, f:c};
}), Da = a => B(Ba, a, ["key", "val", "def", "f"]).reduce((b, {key:c, val:d}) => {
  if (void 0 === d) {
    return b[c] = !0, b;
  }
  b[c] = "true" == d ? !0 : "false" == d ? !1 : /^\d+$/.test(d) ? parseInt(d, 10) : d;
  return b;
}, {});
const Ea = a => Object.keys(a).reduce((b, c) => {
  const d = a[c];
  if (void 0 === d) {
    return b;
  }
  b[c] = d;
  return b;
}, {}), Fa = a => a.reduce((b, c) => b && "string" == typeof c, !0);
async function Ga({ApiUser:a, ApiKey:b, ClientIp:c, host:d}, e, f = {}, g = "GET") {
  if (!e) {
    throw Error("Command must be passed.");
  }
  f = Ea(f);
  b = {ApiUser:a, ApiKey:b, UserName:a, ClientIp:c, Command:e};
  a = {"User-Agent":"Mozilla/5.0 (Node.JS; @rqt/namecheap v2.4.0) https://github.com/rqt/namecheap"};
  if ("GET" == g) {
    g = Aa({...b, ...f}), d = await A(`${d}/xml.response?${g}`, {headers:a});
  } else {
    if ("POST" == g) {
      g = Aa(b), d = await A(`${d}/xml.response?${g}`, {data:f, headers:a, type:"form"});
    } else {
      throw Error("Unknown method.");
    }
  }
  d = d.body;
  if (!d.startsWith('<?xml version="1.0" encoding="utf-8"?>')) {
    throw Error("non-xml response");
  }
  if (g = Ha(d)) {
    throw g;
  }
  [{content:d}] = C("CommandResponse", d);
  return d.trim();
}
const Ha = a => {
  [{content:a}] = C("Errors", a);
  if (a.length) {
    var b = C("Error", a);
    if (1 == b.length) {
      const [{content:c, f:d}] = b;
      a = c;
      b = d;
    } else {
      a = b.map(({content:c}) => c).join("; "), b = b.map(({f:c}) => c);
    }
    a = new Ia(a);
    a.props = b;
    return a;
  }
};
class Ia extends Error {
}
;const Ja = {name:"name", expire:"expiredate", create:"createdate"}, Ka = (a, b) => {
  if (!["name", "expire", "create"].includes(a.toLowerCase())) {
    throw Error(`Unknown sort by option: ${a}.`);
  }
  a = Ja[a].toUpperCase();
  return b ? `${a}_DESC` : a;
};
async function La(a, b = {}) {
  const {page:c, sort:d, desc:e, filter:f, type:g, pageSize:h} = b;
  b = {Page:c, PageSize:h, SortBy:d ? Ka(d, e) : Ka("create", "desc"), SearchTerm:f, ListType:g};
  b = await a("namecheap.domains.getList", b);
  a = C("Domain", b).map(({f:m}) => m);
  var [{content:k}] = C("Paging", b);
  [{content:b}] = C("TotalItems", k);
  const [{content:l}] = C("CurrentPage", k);
  [{content:k}] = C("PageSize", k);
  return {domains:a, TotalItems:parseInt(b, 10), CurrentPage:parseInt(l, 10), PageSize:parseInt(k, 10)};
}
;const Ma = a => {
  let b, c, d;
  [{content:b}] = C("ID", a);
  try {
    [{f:d}] = C("EmailDetails", a);
  } catch (e) {
  }
  try {
    [{content:c}] = C("ExpiredDate", a);
  } catch (e) {
  }
  return {ID:parseInt(b, 10), ...c ? {ExpiredDate:c} : {}, ...d ? {EmailDetails:d} : {}};
}, Na = a => {
  const [{content:b}] = C("UseAutoRenew", a), [{content:c}] = C("SubscriptionId", a), [{content:d}] = C("CreatedDate", a), [{content:e}] = C("ExpirationDate", a);
  [{content:a}] = C("IsActive", a);
  return {UseAutoRenew:"true" == b, SubscriptionId:parseInt(c, 10), CreatedDate:new Date(Date.parse(d)), ExpirationDate:new Date(Date.parse(e)), IsActive:1 == a};
}, Oa = a => {
  const [{content:b, f:c}] = C("DomainGetInfoResult", a);
  var [{content:d}] = C("DomainDetails", b);
  [{content:a}] = C("CreatedDate", d);
  const [{content:e}] = C("ExpiredDate", d);
  [{content:d}] = C("NumYears", d);
  const [{content:f, f:g}] = C("Whoisguard", b), h = Ma(f);
  var [{content:k}] = C("PremiumDnsSubscription", b);
  k = Na(k);
  const [{content:l, f:m}] = C("DnsDetails", b), n = C("Nameserver", l).map(({content:u}) => u), [{content:p, f:t}] = C("Modificationrights", b);
  let r = {};
  p && (r = C("Rights", p).reduce((u, {f:x}) => {
    ({Type:x} = x);
    return {...u, [x]:!0};
  }, {}));
  return {...c, DomainDetails:{CreatedDate:a, ExpiredDate:e, NumYears:parseInt(d, 10)}, Whoisguard:{...g, ...h}, PremiumDnsSubscription:k, DnsDetails:{...m, Nameserver:n}, Modificationrights:{...t, ...r}};
};
async function Pa(a, b) {
  const {domain:c, host:d} = "string" == typeof b ? {domain:b} : b;
  a = await a("namecheap.domains.getinfo", {DomainName:c, HostName:d});
  return Oa(a);
}
;async function Qa(a, b) {
  const {domains:c = [], domain:d} = "string" == typeof b ? {domain:b} : b;
  if (!Array.isArray(c)) {
    throw Error("Domains must be a list.");
  }
  if (!Fa(c)) {
    throw Error("All domains must be strings.");
  }
  if (d && "string" != typeof d) {
    throw Error("Domain must be a string.");
  }
  b = [...c, ...d ? [d] : []];
  a = await a("namecheap.domains.check", {DomainList:b.join(",")});
  return C("DomainCheckResult", a).map(({f:e}) => e);
}
;async function Ra(a, b) {
  const {domain:c, years:d = 1, promo:e, address:f, registrantAddress:g = f, techAddress:h = f, adminAddress:k = f, billingAddress:l = f, nameservers:m = [], whois:n = !0, premium:p = {}} = b;
  b = E(g, "Registrant");
  const t = E(h, "Tech"), r = E(k, "Admin"), u = E(l, "AuxBilling");
  a = await a("namecheap.domains.create", {DomainName:c, Years:d, PromotionCode:e, ...b, ...t, ...r, ...u, Nameservers:m.join(","), AddFreeWhoisguard:n ? "yes" : "no", WGEnabled:n ? "yes" : "no", ...p}, "POST");
  [{f:a}] = C("DomainCreateResult", a);
  return a;
}
const Sa = "JobTitle FirstName LastName Address1 Address2 City StateProvince StateProvinceChoice Country Phone PhoneExt Fax EmailAddress".split(" "), E = (a, b) => Sa.reduce((c, d) => ({...c, [`${b}${d}`]:"StateProvince" != d || a[d] ? a[d] : "NA"}), {[`${b}OrganizationName`]:a.Organization, [`${b}PostalCode`]:a.Zip});
async function Ta(a, {I:b, J:c}) {
  a = await a("namecheap.domains.dns.getHosts", {SLD:b, TLD:c});
  const [{content:d, f:e}] = C("DomainDNSGetHostsResult", a);
  a = F(d, "Host");
  b = F(d, "host");
  c = F(d, "HOST");
  a = [...a, ...b, ...c];
  return {...e, hosts:a};
}
const F = (a, b) => C(b, a).map(({f:c}) => c);
async function Ua(a, b, c) {
  b = c.reduce((d, e, f) => {
    Object.entries(e).forEach(([g, h]) => {
      ["HostName", "RecordType", "Address", "MXPref", "TTL"].includes(g) && (d[`${g}${f + 1}`] = h);
    });
    return d;
  }, b);
  a = await a("namecheap.domains.dns.setHosts", b, "POST");
  [{f:a}] = C("DomainDNSSetHostsResult", a);
  return a;
}
;async function Va(a) {
  a = await a("namecheap.users.address.getList");
  [{content:a}] = C("AddressGetListResult", a);
  return C("List", a).map(({f:b}) => b);
}
;const Wa = q("expensive");
async function Xa(a, b) {
  a = await a("namecheap.users.address.getInfo", {AddressId:b});
  [{content:a}] = C("GetAddressInfoResult", a);
  return Ya(a);
}
const Za = "AddressId UserName AddressName Default_YN FirstName LastName JobTitle Organization Address1 Address2 City StateProvince StateProvinceChoice Zip Country Phone PhoneExt EmailAddress".split(" "), Ya = a => Za.reduce((b, c) => {
  try {
    let [{content:d}] = C(c, a);
    "Default_YN" == c ? d = "true" == d : "AddressId" == c && (d = parseInt(d, 10));
    return {...b, [c]:d};
  } catch (d) {
    return Wa(`Could not extract tag ${c}`), b;
  }
}, {});
const ab = async(a, b) => {
  const {type:c, category:d, promoCode:e, action:f, product:g} = b;
  a = await a("namecheap.users.getPricing", {ProductType:c, ProductCategory:d, PromotionCode:e, ActionName:f, ProductName:g});
  return C("ProductType", a).reduce((h, {content:k, f:{Name:l}}) => {
    k = $a(k);
    h[l] = k;
    return h;
  }, {});
}, $a = a => C("ProductCategory", a).reduce((b, {content:c, f:{Name:d}}) => {
  c = bb(c);
  b[d] = c;
  return b;
}, {}), bb = a => C("Product", a).reduce((b, {content:c, f:{Name:d}}) => {
  c = C("Price", c).map(({f:e}) => e);
  d = d.replace(/-(.)/g, (e, f) => f.toUpperCase());
  b[d] = c;
  return b;
}, {});
class cb {
  constructor(a) {
    const {user:b, key:c, sandbox:d = !1, ip:e} = a;
    this.u = b;
    this.o = c;
    this.b = `https://api.${d ? "sandbox." : ""}namecheap.com`;
    this.g = e;
    const f = this.s.bind(this);
    this.users = {async getPricing(g) {
      return await ab(f, g);
    }};
    this.domains = {async getList(g = {}) {
      return await La(f, g);
    }, async getInfo(g) {
      return await Pa(f, g);
    }, async check(g) {
      return await Qa(f, g);
    }, async create(g) {
      return await Ra(f, g);
    }};
    this.address = {async getList() {
      return await Va(f);
    }, async getInfo(g) {
      return await Xa(f, g);
    }};
    this.dns = {async getHosts(g) {
      const [h, ...k] = g.split(".");
      g = k.join(".");
      return await Ta(f, {I:h, J:g});
    }, async setHosts(g, h, k = {}) {
      const [l, ...m] = g.split(".");
      g = m.join(".");
      return await Ua(f, {SLD:l, TLD:g, ...k}, h);
    }};
  }
  async s(a, b, c) {
    const d = y(!0);
    try {
      return await Ga({ApiKey:this.o, ApiUser:this.u, host:this.b, ClientIp:this.g}, a, b, c);
    } catch (e) {
      if (e instanceof Ia) {
        throw d(e);
      }
      throw e;
    }
  }
}
;const {createReadStream:db, createWriteStream:eb, existsSync:fb, stat:gb} = fs;
async function hb(a) {
  a = db(a);
  return await qa(a);
}
;async function ib(a, b) {
  if (!a) {
    throw Error("No path is given.");
  }
  const c = y(!0), d = eb(a);
  await new Promise((e, f) => {
    d.on("error", g => {
      g = c(g);
      f(g);
    }).on("close", e).end(b);
  });
}
;const jb = q("bosom"), kb = async(a, b, c) => {
  const {replacer:d = null, space:e = null} = c;
  b = JSON.stringify(b, d, e);
  await ib(a, b);
}, G = async(a, b, c = {}) => {
  if (b) {
    return await kb(a, b, c);
  }
  jb("Reading %s", a);
  a = await hb(a);
  return JSON.parse(a);
};
const lb = async(a, b = {}) => {
  ({body:a} = await A(a, b));
  return a;
};
async function I(a, b, c = {}) {
  {
    const {headers:d = {}, ...e} = c;
    c = {...e, headers:{...a.headers, ...d, Cookie:a.Cookie}};
  }
  b = await A(a.host ? `${a.host}${b}` : b, c);
  ({headers:c} = b);
  a.cookies = mb(a.cookies, c);
  return b;
}
class nb {
  constructor(a = {}) {
    const {host:b, headers:c = {}} = a;
    this.host = b;
    this.headers = c;
    this.cookies = {};
  }
  async rqt(a, b = {}) {
    ({body:a} = await I(this, a, b));
    return a;
  }
  async bqt(a, b = {}) {
    ({body:a} = await I(this, a, {...b, binary:!0}));
    return a;
  }
  async jqt(a, b = {}) {
    ({body:a} = await I(this, a, b));
    return a;
  }
  async aqt(a, b = {}) {
    return await I(this, a, b);
  }
  get Cookie() {
    return ob(this.cookies);
  }
}
const ob = a => Object.keys(a).reduce((b, c) => {
  c = `${c}=${a[c]}`;
  return [...b, c];
}, []).join("; "), mb = (a, b) => {
  b = pb(b);
  const c = {...a, ...b};
  return Object.keys(c).reduce((d, e) => {
    const f = c[e];
    return f ? {...d, [e]:f} : d;
  }, {});
}, pb = ({"set-cookie":a = []} = {}) => a.reduce((b, c) => {
  {
    const d = /^(.+?)=(.*?);/.exec(c);
    if (!d) {
      throw Error(`Could not extract a cookie from ${c}`);
    }
    const [, e, f] = d;
    c = {[e]:f};
  }
  return {...b, ...c};
}, {});
async function qb() {
  const {host:a = "https://api.ipify.org"} = {};
  return await lb(a);
}
;const {ok:J} = assert;
const {createInterface:rb} = readline;
function ub(a, b, c) {
  return setTimeout(() => {
    const d = Error(`${a ? a : "Promise"} has timed out after ${b}ms`);
    d.stack = `Error: ${d.message}`;
    c(d);
  }, b);
}
function vb(a, b) {
  let c;
  const d = new Promise((e, f) => {
    c = ub(a, b, f);
  });
  return {timeout:c, j:d};
}
async function wb(a, b, c) {
  if (!(a instanceof Promise)) {
    throw Error("Promise expected");
  }
  if (!b) {
    throw Error("Timeout must be a number");
  }
  if (0 > b) {
    throw Error("Timeout cannot be negative");
  }
  const {j:d, timeout:e} = vb(c, b);
  try {
    return await Promise.race([a, d]);
  } finally {
    clearTimeout(e);
  }
}
;function xb(a, b = {}) {
  const {timeout:c, password:d = !1, output:e = process.stdout, input:f = process.stdin, ...g} = b;
  b = rb({input:f, output:e, ...g});
  if (d) {
    const k = b.output;
    b._writeToOutput = l => {
      if (["\r\n", "\n", "\r"].includes(l)) {
        return k.write(l);
      }
      l = l.split(a);
      "2" == l.length ? (k.write(a), k.write("*".repeat(l[1].length))) : k.write("*");
    };
  }
  var h = new Promise(b.question.bind(b, a));
  h = c ? wb(h, c, `reloquent: ${a}`) : h;
  b.promise = yb(h, b);
  return b;
}
const yb = async(a, b) => {
  try {
    return await a;
  } finally {
    b.close();
  }
};
async function zb(a, b) {
  if ("object" != typeof a) {
    throw Error("Please give an object with questions");
  }
  return await Object.keys(a).reduce(async(c, d) => {
    c = await c;
    var e = a[d];
    switch(typeof e) {
      case "object":
        e = {...e};
        break;
      case "string":
        e = {text:e};
        break;
      default:
        throw Error("A question must be a string or an object.");
    }
    e.text = `${e.text}${e.text.endsWith("?") ? "" : ":"} `;
    var f;
    if (e.defaultValue) {
      var g = e.defaultValue;
    }
    e.getDefault && (f = await e.getDefault());
    let h = g || "";
    g && f && g != f ? h = `\x1b[90m${g}\x1b[0m` : g && g == f && (h = "");
    g = f || "";
    ({promise:g} = xb(`${e.text}${h ? `[${h}] ` : ""}${g ? `[${g}] ` : ""}`, {timeout:b, password:e.password}));
    f = await g || f || e.defaultValue;
    "function" == typeof e.validation && e.validation(f);
    "function" == typeof e.postProcess && (f = await e.postProcess(f));
    return {...c, [d]:f};
  }, {});
}
;async function Ab(a, b) {
  return await zb(a, b);
}
async function Bb(a) {
  ({question:a} = await zb({question:a}, void 0));
  return a;
}
async function K(a, b = {}) {
  const {defaultYes:c = !0, timeout:d} = b;
  b = a.endsWith("?");
  ({question:a} = await zb({question:{text:`${b ? a.replace(/\?$/, "") : a} (y/n)${b ? "?" : ""}`, defaultValue:c ? "y" : "n"}}, d));
  return "y" == a;
}
;/*
 diff package https://github.com/kpdecker/jsdiff
 BSD License
 Copyright (c) 2009-2015, Kevin Decker <kpdecker@gmail.com>
*/
const Cb = {black:30, red:31, green:32, yellow:33, blue:34, magenta:35, cyan:36, white:37, grey:90}, Db = {black:40, red:41, green:42, yellow:43, blue:44, magenta:45, cyan:46, white:47};
function L(a, b) {
  return (b = Cb[b]) ? `\x1b[${b}m${a}\x1b[0m` : a;
}
function Eb(a) {
  const b = Db.green;
  return b ? `\x1b[${b}m${a}\x1b[0m` : a;
}
;const Fb = a => B(/<input type="hidden" name="(.+?)" id="__\w+" value="(.*?)" \/>/g, a, ["name", "value"]).reduce((b, {name:c, value:d}) => ({...b, [c]:d}), {}), Gb = a => {
  const b = /(.+?)(\d\d\d)$/.exec(a);
  if (!b) {
    return a;
  }
  const [, c, d] = b;
  return `${L(c, "grey")}${d}`;
}, Hb = a => a.map(({title:b}) => ` ${b}`).map(Gb).join("\n"), Ib = async(a, b) => {
  var c = `Which phone number to use for 2 factor auth
${Hb(a)}
enter last 3 digits`;
  const d = await Bb({text:c, async getDefault() {
    return b || a[0].last;
  }, validation(e) {
    if (!a.some(({last:f}) => f == e)) {
      throw Error("Unknown number entered.");
    }
  }});
  ({value:c} = a.find(({last:e}) => e == d));
  return c;
}, Jb = (a, b) => {
  var c = Object.keys(a).reduce((d, e) => {
    var f = a[e];
    const g = b[e];
    return e in b ? f !== g ? (f = L(`${`-  ${e}`}: ${f}`, "red"), e = L(`${`+  ${e}`}: ${g}`, "green"), [...d, f, e]) : d : (e = L(`${`-  ${e}`}: ${f}`, "red"), [...d, e]);
  }, []);
  c = Object.keys(b).reduce((d, e) => {
    const f = a[e];
    return e in a ? d : (e = L(`${`+  ${e}`}: ${f}`, "green"), [...d, e]);
  }, c);
  if (c.length) {
    throw c = `
{
${c.join("\n")}
}`.trim(), Error(c);
  }
};
const Kb = q("@rqt/namecheap-web");
async function Lb(a) {
  const {SessionKey:b} = await a.session.jqt("/cart/ajax/SessionHandler.ashx");
  if (!b) {
    throw Error(`Could not acquire the session key from ${a.session.host}${"/cart/ajax/SessionHandler.ashx"}.`);
  }
  Kb("Obtained a session key %s", b);
  a.b = b;
}
async function Mb(a, b = !1) {
  var c = await a.session.rqt(M.b);
  J(/Select Phone Contact Number/.test(c), 'Could not find the "Select Phone" section.');
  var d = B(/<option value="(\d+-phone)">(.+?(\d\d\d))<\/option>/g, c, ["value", "title", "last"]);
  J(d.length, "Could not find any numbers.");
  d = await Ib(d, a.s);
  c = await a.session.rqt(M.b, {data:{...Fb(c), ctl00$ctl00$ctl00$ctl00$base_content$web_base_content$home_content$page_content_left$CntrlAuthorization$ddlAuthorizeList:d, ctl00$ctl00$ctl00$ctl00$base_content$web_base_content$home_content$page_content_left$CntrlAuthorization$btnSendVerification:"Proceed with Login"}, type:"form"});
  if (/You have reached the limit on the number.+/m.test(c)) {
    throw Error(c.match(/You have reached the limit on the number.+/m)[0]);
  }
  d = /Error occured during Two-Factor authentication provider call./m.test(c);
  if (!b && d) {
    return console.log("Received an error message: Error occured during Two-Factor authentication provider call."), console.log("Retrying to get the code, if you get 2 messages, dismiss the first one."), await Mb(a, !0);
  }
  if (b && d) {
    throw Error("Error occured during Two-Factor authentication provider call.");
  }
  J(/We sent a message with the verification code/.test(c), "Could not find the code entry section.");
  await Nb(a, c);
}
async function Ob(a) {
  const {body:b, statusCode:c, headers:{location:d}} = await a.session.aqt(M.g, {data:{hidden_LoginPassword:"", LoginUserName:a.u, LoginPassword:a.o, sessionEncryptValue:a.b}, type:"form"});
  if (200 == c) {
    {
      const [, e] = /<strong class="title">Validation Error<\/strong>\s+<div>(.+?)<\/div>/.exec(b) || [];
      if (e) {
        throw Error(e.replace(/(<([^>]+)>)/ig, ""));
      }
    }
  } else {
    if (301 == c) {
      return a.session.cookies;
    }
  }
  if (302 == c && d.includes(M.b)) {
    await Mb(a);
  } else {
    throw Error(`Unknown result (status code ${c})`);
  }
  ({cookies:a} = a.session);
  return a;
}
async function Nb(a, b) {
  var [, c] = /Your 6-digit code begins with (\d)./.exec(b) || [];
  if (!c) {
    throw Error("Could not send the code.");
  }
  c = await Bb({text:`Security code (begins with ${c})`});
  const {body:d, headers:{location:e}} = await a.session.aqt(M.b, {data:{...Fb(b), ctl00$ctl00$ctl00$ctl00$base_content$web_base_content$home_content$page_content_left$CntrlAuthorization$txtAuthVerification:c, ctl00$ctl00$ctl00$ctl00$base_content$web_base_content$home_content$page_content_left$CntrlAuthorization$btnVerify:"Submit Security Code"}, type:"form"});
  if (/Oops, you entered an invalid code.+/m.test(d)) {
    return console.log("Incorrect code, try again."), await Nb(a, d);
  }
  J(/Object moved/.test(d), "Expected to have been redirected after sign-in.");
  return e;
}
class M {
  constructor({username:a, password:b, phone:c, host:d, userAgent:e} = {}) {
    d = new nb({host:d, headers:{"User-Agent":e}});
    this.u = a;
    this.o = b;
    this.g = d;
    this.s = c;
    this.b = null;
  }
  static get g() {
    return "/myaccount/login-signup/";
  }
  static get b() {
    return "/myaccount/twofa/secondauth.aspx";
  }
  get session() {
    return this.g;
  }
}
;const Pb = a => {
  if (a.__isError) {
    var b = Error(a.Message);
    Object.assign(b, a);
    throw b;
  }
  if (!a.Success) {
    throw b = a.Errors.map(({Message:c}) => c).join(", "), b = Error(b), b.__type = a.__type, b;
  }
};
function Qb(a) {
  return `/api/v1/ncpl/apiaccess/ui/${a}`;
}
async function Rb(a) {
  ({statusCode:a} = await a.session.aqt("/", {justHeaders:!0}));
  return 200 == a;
}
async function Sb(a) {
  a = await a.session.rqt(Tb.b);
  a = /<input type="hidden" id="x-ncpl-csrfvalue" value="(.+?)"/.exec(a);
  if (!a) {
    throw Error("Could not find the x-ncpl-csrfvalue token on the page.");
  }
  [, a] = a;
  return a;
}
async function Ub(a, b, c = `@rqt ${(new Date).toLocaleString()}`.replace(/:/g, "-")) {
  const d = await Sb(a);
  await a.request(Qb("AddIpAddress"), d, {accountPassword:a.password, ipAddress:b, name:c});
}
async function Vb(a, b) {
  const c = await Sb(a);
  await a.request(Qb("RemoveIpAddresses"), c, {accountPassword:a.password, names:[b]});
}
async function Wb(a) {
  const b = await Sb(a);
  ({IpAddresses:a} = await a.request(Qb("GetWhitelistedIpAddresses"), b));
  return a.map(({Name:c, IpAddress:d, ModifyDate:e}) => ({Name:c, IpAddress:d, ModifyDate:new Date(`${e}Z`)}));
}
class Tb {
  constructor({cookies:a, host:b, userAgent:c, password:d}) {
    b = new nb({host:b, headers:{"User-Agent":c}});
    b.cookies = a;
    this.b = b;
    this.password = d;
  }
  get session() {
    return this.b;
  }
  static get b() {
    return "/settings/tools/apiaccess/whitelisted-ips";
  }
  async request(a, b, c) {
    a = await this.session.jqt(a, {data:c, headers:{"x-ncpl-rcsrf":b}});
    Pb(a);
    ({Data:a} = a);
    return a;
  }
}
;const Xb = async a => {
  var b = new nb({host:"https://www.namecheap.com/domains/whois", headers:{"User-Agent":"Mozilla/5.0 (Node.js; @rqt/namecheap-web) https://github.com/rqt/namecheap-web"}});
  a = await b.rqt(`/results.aspx?domain=${a}`);
  a = /var url = "\/domains\/whois\/whois-ajax\.aspx\?(.+?)"/.exec(a);
  if (!a) {
    throw Error("Could not find the AJAX request URL.");
  }
  [, a] = a;
  b = await b.rqt(`/whois-ajax.aspx?${a}`);
  b = /<pre id=".+?_whoisResultText" class="wrapped whois">([\s\S]+)<\/pre>/.exec(b);
  if (!b) {
    throw Error("Could not extract data.");
  }
  [, b] = b;
  return b;
};
const Yb = async(a = !1) => {
  a = await lb(`https://www.${a ? "sandbox." : ""}namecheap.com/promos/coupons/`, {headers:{"User-Agent":"Mozilla/5.0 (Node.js; @rqt/namecheap-web) https://github.com/rqt/namecheap-web"}});
  a = /<small>Coupon Code<\/small>\s+.+couponCode">(.+)<\/span>/.exec(a);
  if (!a) {
    throw Error("Could not find the coupon code.");
  }
  return a[1];
};
const Zb = q("@rqt/namecheap-web"), $b = (a = !1) => `https://www.${a ? "sandbox." : ""}namecheap.com`, ac = (a = !1) => `https://ap.www.${a ? "sandbox." : ""}namecheap.com`;
async function bc(a, b) {
  a.g.readSession && await cc(b, a.g.sessionFile);
}
async function N(a, b) {
  const c = dc(a.b.session.cookies);
  b = await b;
  const d = dc(a.b.session.cookies);
  try {
    Jb(c, d);
  } catch ({message:e}) {
    Zb(e), await bc(a, d);
  }
  return b;
}
class O {
  constructor(a = {}) {
    const {sandbox:b, readSession:c, sessionFile:d = ".namecheap-web.json"} = a;
    this.g = {sandbox:b, readSession:c, sessionFile:d};
    this.b = null;
  }
  static async["LOOKUP_IP"]() {
    return await qb();
  }
  static async["WHOIS"](a) {
    return Xb(a);
  }
  static async["COUPON"]() {
    return Yb();
  }
  static async["SANDBOX_COUPON"]() {
    return Yb(!0);
  }
  async auth(a, b, c, d = !1) {
    var e;
    this.g.readSession && !d && (e = await ec(this.g.sessionFile));
    e || (e = new M({username:a, password:b, host:$b(this.g.sandbox), phone:c, userAgent:"Mozilla/5.0 (Node.js; @rqt/namecheap-web) https://github.com/rqt/namecheap-web"}), await Lb(e), e = await Ob(e), await bc(this, e));
    this.b = new Tb({cookies:e, password:b, host:ac(this.g.sandbox), userAgent:"Mozilla/5.0 (Node.js; @rqt/namecheap-web) https://github.com/rqt/namecheap-web"});
    e = await N(this, Rb(this.b));
    if (!e && d) {
      throw Error("Could not authenticate.");
    }
    e || await this.auth(a, b, c, !0);
  }
  async whitelistIP(a, b) {
    await N(this, Ub(this.b, a, b));
  }
  async getWhitelistedIPList() {
    return await N(this, Wb(this.b));
  }
  async removeWhitelistedIP(a) {
    await N(this, Vb(this.b, a));
  }
}
const dc = a => {
  const b = ["x-ncpl-auth", ".ncauth", "SessionId", "U"];
  return Object.keys(a).reduce((c, d) => b.includes(d) ? {...c, [d]:a[d]} : c, {});
}, ec = async a => {
  try {
    return await G(a);
  } catch (b) {
    return null;
  }
}, cc = async(a, b) => {
  await G(b, a);
};
function P(a = {usage:{}}) {
  const {usage:b = {}, description:c, line:d, example:e} = a;
  a = Object.keys(b);
  const f = Object.values(b), [g] = a.reduce(([l = 0, m = 0], n) => {
    const p = b[n].split("\n").reduce((t, r) => r.length > t ? r.length : t, 0);
    p > m && (m = p);
    n.length > l && (l = n.length);
    return [l, m];
  }, []), h = (l, m) => {
    m = " ".repeat(m - l.length);
    return `${l}${m}`;
  };
  a = a.reduce((l, m, n) => {
    n = f[n].split("\n");
    m = h(m, g);
    const [p, ...t] = n;
    m = `${m}\t${p}`;
    const r = h("", g);
    n = t.map(u => `${r}\t${u}`);
    return [...l, m, ...n];
  }, []).map(l => `\t${l}`);
  const k = [c, `  ${d || ""}`].filter(l => l ? l.trim() : l).join("\n\n");
  a = `${k ? `${k}\n` : ""}
${a.join("\n")}
`;
  return e ? `${a}
  Example:

    ${e}
` : a;
}
;const fc = (a, b, c, d = !1, e = !1) => {
  const f = c ? new RegExp(`^-(${c}|-${b})`) : new RegExp(`^--${b}`);
  b = a.findIndex(g => f.test(g));
  if (-1 == b) {
    return {argv:a};
  }
  if (d) {
    return {value:!0, argv:[...a.slice(0, b), ...a.slice(b + 1)]};
  }
  d = b + 1;
  c = a[d];
  if (!c || "string" == typeof c && c.startsWith("--")) {
    return {argv:a};
  }
  e && (c = parseInt(c, 10));
  return {value:c, argv:[...a.slice(0, b), ...a.slice(d + 1)]};
};
function Q(a = {}, b = process.argv) {
  [, , ...b] = b;
  const c = gc(b);
  b = b.slice(c.length);
  let d = !c.length;
  return Object.keys(a).reduce(({h:e, ...f}, g) => {
    if (0 == e.length && d) {
      return {h:e, ...f};
    }
    const h = a[g];
    let k;
    if ("string" == typeof h) {
      ({value:k, argv:e} = fc(e, g, h));
    } else {
      try {
        const {short:l, boolean:m, number:n, command:p, multiple:t} = h;
        p && t && c.length ? (k = c, d = !0) : p && c.length ? (k = c[0], d = !0) : {value:k, argv:e} = fc(e, g, l, m, n);
      } catch (l) {
        return {h:e, ...f};
      }
    }
    return void 0 === k ? {h:e, ...f} : {h:e, ...f, [g]:k};
  }, {h:b});
}
const gc = a => {
  const b = [];
  for (let c = 0; c < a.length; c++) {
    const d = a[c];
    if (d.startsWith("-")) {
      break;
    }
    b.push(d);
  }
  return b;
}, R = a => Object.keys(a).reduce((b, c) => {
  const d = a[c];
  if ("string" == typeof d) {
    return b[`-${d}`] = "", b;
  }
  c = d.command ? c : `--${c}`;
  d.short && (c = `${c}, -${d.short}`);
  let e = d.description;
  d.default && (e = `${e}\nDefault: ${d.default}.`);
  b[c] = e;
  return b;
}, {});
const hc = {domains:{description:"The domain name for operations, or multiple domain names\nfor checking availability.", command:!0, multiple:!0}, init:{description:"Initialise package configuration interactively, i.e.,\nthe API key and ip address.", boolean:!0, short:"I"}, info:{description:"Show the information for the domain.", boolean:!0, short:"i"}, register:{description:"Register the domain.", boolean:!0, short:"r"}, github:{description:"Setup GitHub pages for the apex domain as per docs\nhttps://git.io/fjyr7 Also removes the parking page\nand URL redirect. All other hosts are kept itact.", 
boolean:!0, short:"g"}, whois:{description:"Display brief WHOIS data.", boolean:!0, short:"w"}, Whois:{description:"Display full WHOIS data.", boolean:!0}, coupon:{description:"Find this month's coupon.", boolean:!0}, sandbox:{description:"Use the sandbox API.", boolean:!0, short:"s"}, whitelistIP:{description:"Add current IP address to the list of white-listed ones.", boolean:!0, short:"W"}, version:{description:"Display the current version number.", boolean:!0, short:"v"}, help:{description:"Show help information.", 
boolean:!0, short:"h"}}, S = Q(hc), T = S.domains, ic = S.init, jc = S.info, kc = S.register, lc = S.github, mc = S.whois, nc = S.Whois, oc = S.coupon, pc = S.sandbox, qc = S.whitelistIP, rc = S.version, sc = S.help, tc = {free:{description:"Display only free domains.", boolean:!0, short:"f"}, zones:{description:"Check in these zones only.", short:"z"}}, uc = Q(tc, [process.argv[0], process.argv[1], ...S.h]), vc = uc.free, wc = uc.zones, xc = {sort:{description:"Sort by this field (name, expire, create).", 
short:"S"}, desc:{description:"Sort in descending order.", boolean:!0, short:"D"}, filter:{description:"Filter by this word.", short:"F"}, pageSize:{description:"The page size.", short:"P"}, type:{description:"Domain type (ALL, EXPIRING, EXPIRED).", short:"T"}}, U = Q(xc, [process.argv[0], process.argv[1], ...uc.h]), yc = U.sort, zc = U.desc, Ac = U.filter, Bc = U.pageSize, Cc = U.type, Dc = {promo:{description:"Use this promo code on registration.", short:"p"}, years:{description:"The number of years that the domain should be registered for.", 
short:"y"}}, Ec = Q(Dc, [process.argv[0], process.argv[1], ...U.h]), Fc = Ec.promo, Gc = Ec.years;
const Hc = "com net org biz co cc io bz nu app page".split(" "), Ic = (a, b) => (b.length ? Hc.filter(c => b.includes(c)) : Hc).map(c => `${a}.${c}`), Jc = L("\u2713", "green"), Kc = L("-", "grey"), Lc = a => a.map(b => {
  const {Created:c, Expires:d, IsOurDNS:e} = b, f = Date.parse(c), g = Date.parse(d), h = (new Date).getTime();
  return {...b, Since:Math.round(Math.abs((h - f) / 864E5)), Expiry:Math.round(Math.abs((g - h) / 864E5)), Years:Math.abs((new Date(h - (new Date(f)).getTime())).getUTCFullYear() - 1970), DNS:e};
}), Mc = a => "ENABLED" == a ? {value:Jc, length:1} : "NOTPRESENT" == a ? {value:Kc, length:1} : {value:a, length:a.length}, Nc = a => a ? "expensive-sandbox" : "expensive";
const Oc = Hc.join(", ");
const Pc = a => ({value:`\x1b[1m${a}\x1b[0m`, length:a.length}), Qc = a => a.reduce((b, c) => ({...b, [c]:!0}), {});
function V(a) {
  const {keys:b = [], data:c = [], headings:d = {}, replacements:e = {}, centerValues:f = [], centerHeadings:g = []} = a;
  var [h] = c;
  if (!h) {
    return "";
  }
  const k = Qc(f);
  a = Qc(g);
  h = Object.keys(h).reduce((n, p) => {
    const t = d[p];
    return {...n, [p]:t ? t.length : p.length};
  }, {});
  const l = c.reduce((n, p) => Object.keys(p).reduce((t, r) => {
    const u = n[r], {length:x} = Rc(e, r)(p[r]);
    return {...t, [r]:Math.max(x, u)};
  }, {}), h);
  h = b.reduce((n, p) => ({...n, [p]:d[p] || p}), {});
  const m = b.reduce((n, p) => ({...n, [p]:Pc}), {});
  a = Sc(b, h, l, m, a);
  h = c.map(n => Sc(b, n, l, e, k));
  return [a, ...h].join("\n");
}
const Tc = (a, b, c, d) => {
  if (void 0 === a) {
    return " ".repeat(b);
  }
  let e = a;
  if (c) {
    const {value:f, length:g} = c(a);
    e = f;
    a = g;
  } else {
    a = `${a}`.length;
  }
  b -= a;
  if (d) {
    return d = Math.floor(b / 2), b -= d, " ".repeat(d) + e + " ".repeat(b);
  }
  d = " ".repeat(b);
  return `${e}${d}`;
}, Rc = (a, b) => (a = a[b]) ? a : c => ({value:c, length:`${c}`.replace(/\033\[.*?m/g, "").length}), Sc = (a, b, c, d = {}, e = {}) => {
  let f = 0;
  return a.map(g => {
    const h = c[g];
    if (!h) {
      throw Error(`Unknown field ${g}`);
    }
    var k = b[g];
    const l = Rc(d, g), m = e[g], [n, ...p] = `${k}`.split("\n");
    g = Tc(n, h, l, m);
    k = "";
    p.length && (k = "\n" + p.map(t => {
      const r = " ".repeat(f);
      t = Tc(t, h, l, m);
      return `${r}${t}`;
    }).join("\n"));
    f += h + 2;
    return `${g}${k}`;
  }).join("  ");
};
function Uc(a = []) {
  a.length ? (a = Lc(a), a = V({keys:["Name", "Expiry", "Years", "WhoisGuard", "DNS"], data:a, headings:{WhoisGuard:"Whois"}, replacements:{WhoisGuard:Mc, ["DNS"](b) {
    return b ? {value:"yes", length:3} : {value:"", length:0};
  }, ["Years"](b) {
    return b ? {value:b, length:`${b}`.length} : {value:"", length:0};
  }}, centerValues:["WhoisGuard"]}), console.log(a)) : console.log("No domains");
}
;async function Vc(a, {sort:b, desc:c, page:d, filter:e, type:f, pageSize:g} = {}) {
  const {domains:h, ...k} = await a.domains.getList({page:d, sort:b, desc:c, filter:e, type:f, pageSize:g});
  Uc(h);
  (d = Wc(k)) && await K(`Page ${Xc(k)}. Display more`) && await Vc(a, {page:d, sort:b, desc:c, filter:e, type:f, pageSize:g});
}
const Wc = ({CurrentPage:a, TotalItems:b, PageSize:c}) => {
  if (a * c < b) {
    return a + 1;
  }
}, Xc = ({CurrentPage:a, TotalItems:b, PageSize:c}) => `${a}/${Math.ceil(b / c)}`;
const {join:Yc, resolve:Zc} = path;
const W = Zc(w(), ".expensive.log");
async function $c(a) {
  var {domains:b, D:c, M:d = ""} = {domains:T, M:wc, D:vc}, e = b.reduce((h, k) => /\./.test(k) ? [...h, k] : (k = Ic(k, d ? d.split(",") : []), [...h, ...k]), []);
  console.log("Checking domain%s %s", 1 < e.length ? "s" : "", e.join(", "));
  const f = await a.domains.check({domains:e});
  a = e.map(h => {
    const k = f.find(({Domain:l}) => l == h);
    k.PremiumRegistrationPrice && (k.PremiumRegistrationPrice = parseFloat(k.PremiumRegistrationPrice));
    return k;
  });
  a = c ? a.filter(({Available:h}) => h) : a;
  e = a.some(({IsPremiumName:h}) => h);
  const g = a.some(({PremiumRegistrationPrice:h}) => h);
  e = V({keys:["Domain", "Available", ...e ? ["IsPremiumName"] : [], ...g ? ["PremiumRegistrationPrice"] : []], data:a.map(h => ({...h, Available:h.Available ? L("yes", "green") : L("no", "red"), IsPremiumName:h.IsPremiumName ? L("\u2713", "green") : "", PremiumRegistrationPrice:h.PremiumRegistrationPrice ? parseFloat(h.PremiumRegistrationPrice).toFixed(2) : ""})), headings:{IsPremiumName:"Premium", PremiumRegistrationPrice:"Price"}, centerValues:["Available", "IsPremiumName"]});
  console.log(e);
  await ad(b.join(","), a);
}
const ad = async(a, b) => {
  fb(W) || await G(W, []);
  a = [...await G(W), {[a]:b.filter(({Available:c}) => c).map(({Domain:c}) => c)}];
  await G(W, a, {space:2});
};
const bd = (a, b) => {
  a = " ".repeat(Math.max(a - b.length, 0));
  return `${b}${a}`;
}, cd = a => {
  var {width:b} = {};
  a = a.split("\n");
  b = b || a.reduce((c, {length:d}) => d > c ? d : c, 0);
  return a.map(bd.bind(null, b)).join("\n");
};
function dd(a) {
  const {padding:b = 1} = {};
  var c = a.split("\n").reduce((f, {length:g}) => g > f ? g : f, 0) + 2 * b;
  const d = `\u250c${"\u2500".repeat(c)}\u2510`;
  c = `\u2514${"\u2500".repeat(c)}\u2518`;
  const e = " ".repeat(b);
  a = cd(a).split("\n").map(f => `\u2502${e}${f}${e}\u2502`).join("\n");
  return `${d}\n${a}\n${c}`;
}
;async function X(a, b) {
  const {interval:c = 250, writable:d = process.stdout} = {};
  b = "function" == typeof b ? b() : b;
  const e = d.write.bind(d);
  let f = 1, g = `${a}${".".repeat(f)}`;
  e(g);
  const h = setInterval(() => {
    f = (f + 1) % 4;
    g = `${a}${".".repeat(f)}`;
    e(`\r${" ".repeat(a.length + 3)}\r`);
    e(g);
  }, c);
  try {
    return await b;
  } finally {
    clearInterval(h), e(`\r${" ".repeat(a.length + 3)}\r`);
  }
}
;q("expensive");
const ed = a => (a = a.find(({IsDefault:b}) => b)) ? a.AddressId : null, fd = async a => await (a ? O.SANDBOX_COUPON() : O.COUPON()), gd = a => {
  a = a.split(".");
  return a[a.length - 1];
}, hd = (a, b, c) => a.domains.register[b].find(({Duration:d}) => d == c), id = async(a, b, c, d) => {
  const e = await a.users.getPricing({type:"DOMAIN", promoCode:d, action:"REGISTER", product:b});
  if (d) {
    var f = await a.users.getPricing({type:"DOMAIN", action:"REGISTER", product:b});
    ({YourPrice:f} = hd(f, b, c));
  }
  b = hd(e, b, c);
  return {m:d, AdditionalCost:b.YourAdditonalCost, Price:b.YourPrice, S:b.YourPriceType, N:b.YourAdditonalCostType, Currency:b.Currency, v:f};
}, jd = async(a, b, c) => {
  if (a) {
    return console.log("Using promo %s", a), a;
  }
  if (["com", "net", "org", "info", "biz"].includes(c)) {
    try {
      const d = await X("Checking coupon online", fd(b));
      if (await K(`\rApply coupon ${d}?`)) {
        return d;
      }
    } catch (d) {
      console.log("Could not retrieve promo");
    }
  }
}, kd = async({IsPremiumName:a, PremiumRegistrationPrice:b, EapFee:c}) => {
  let d = !0;
  a && (d = await K(`Continue with the premium registration price of ${b}?`, {defaultYes:!1}));
  parseFloat(c) && (d = d && await K(`Continue with the early access fee of ${c}?`, {defaultYes:!1}));
  if (!d) {
    throw Error("No confirmation.");
  }
}, ld = a => a.map(b => ({...b, value:`SKIP-${b.value}`})), md = async(a, {F:b, years:c, promo:d, K:e}) => {
  const {IcannFee:f, PremiumRenewalPrice:g, PremiumTransferPrice:h, PremiumRegistrationPrice:k, IsPremiumName:l, EapFee:m} = a;
  a = await id(b, e, c, d);
  b = [{name:"Premium Registration Price", value:k, l:k}, ...ld([{name:"Premium Renewal Price", value:g}, {name:"Premium Transfer Price", value:h}])];
  c = 0 != parseFloat(m);
  d = [{name:"Eap Fee", value:m, l:m}];
  c = [...l ? b : [], ...c ? d : []];
  d = [{name:"Price", value:a.Price, l:a.Price}, ...ld(a.m ? [{name:"Without Promo", value:a.v}] : []), ...f ? [{name:"Icann Fee", value:f}] : [], ...a.AdditionalCost ? [{name:"Additional Cost", value:`${a.AdditionalCost}`, l:a.AdditionalCost}] : []];
  b = (e = c.length) ? [...c, ...ld(d)] : d;
  c = (e ? c : d).reduce((n, {l:p = 0}) => n + parseFloat(p), 0);
  c = `${Number(c).toFixed(2)} ${a.Currency}`;
  c = [{name:"-----", value:"-".repeat(c.length)}, {name:"Total", value:c}];
  b = V({keys:["name", "value"], data:[...b, ...c], headings:["Price", "Value"], replacements:{value(n) {
    const [, p] = `${n}`.split("SKIP-");
    return p ? {value:L(p, "grey"), length:p.length} : {value:n, length:n.length};
  }}}).replace(/.+\n/, "");
  return {A:a, table:b};
};
async function nd(a, {domain:b, promo:c, sandbox:d, years:e = 1}) {
  const f = (await a.domains.check(b))[0], {Available:g, EapFee:h, PremiumRegistrationPrice:k, Domain:l, IsPremiumName:m} = f;
  if (!g) {
    throw Error(`Domain ${l} is not available.`);
  }
  const n = gd(b), p = await jd(c, d, n), {A:t, table:r} = await X(`Getting ${e}-year price`, md(f, {F:a, promo:p, years:e, K:n}));
  console.log("\n%s", r);
  t.m && parseFloat(t.Price) > parseFloat(t.v) && console.log("[!] Warning: you will pay more with coupon %s than without it.", t.m);
  console.log("");
  m && await kd({IsPremiumName:m, PremiumRegistrationPrice:k, EapFee:h});
  const u = await X("Finding default address", async() => {
    var v = await a.address.getList();
    v = ed(v);
    if (!v) {
      throw Error("Could not find the default address.");
    }
    return await a.address.getInfo(v);
  });
  console.log("\rRegistering %s using:", Eb(b));
  od(u);
  if (await K("OK?", {defaultYes:!1})) {
    var x;
    try {
      ({ChargedAmount:x} = await X("Registering the domain", async() => a.domains.create({address:u, domain:b, years:e, promo:p, ...m ? {premium:{P:!0, R:parseFloat(k), EapFee:parseFloat(h)}} : {}})));
    } catch (v) {
      const {f:H = {}, message:D} = v;
      ({Number:c} = H);
      2515610 == c ? (console.warn("[!] Bug: cannot register a premium with Eap."), console.warn(" -  Response when requesting w/out EapFee:"), console.log("    %s", D)) : /No free connections to registry./.test(D) ? (console.log("    %s", D), console.log("Please try again.")) : 3028166 == c && (console.warn("[!] Possible Bug (e.g., after sending without Eap)"), console.log("    %s", D));
      throw v;
    }
    console.log("Successfully registered %s! Charged amount: $%s.", L(b, "green"), Number(x).toFixed(2));
  }
}
const od = ({FirstName:a, LastName:b, Address1:c, Address2:d, City:e, Zip:f, Country:g, EmailAddress:h}) => {
  a = dd(`${a} ${b}, ${h}
 ${c}${d ? `\n ${d}` : ""}
 ${e}
 ${f}, ${g}`);
  console.log(a);
};
async function pd(a, b) {
  let {hosts:c, IsUsingOurDNS:d} = await a.dns.getHosts(b);
  if (!d) {
    throw Error(`Namecheap DNS is not being used for ${b}`);
  }
  c.reduce(async(f, {Type:g, Name:h, Address:k}) => {
    await f;
    "A" == g && "@" == h && (await K(`An A record at @ (${k}) already exists. Continue?`) || process.exit());
  }, {});
  c = c.filter(({Type:f, Name:g, Address:h}) => "www" == g && "CNAME" == f && "parkingpage.namecheap.com." == h || "@" == g && "URL" == f ? !1 : !0);
  const e = c.map(f => {
    const {TTL:g, Type:h, Address:k, Name:l, MXPref:m} = f;
    return {TTL:g, RecordType:h, Address:k, HostName:l, MXPref:m};
  });
  e.push({Address:"185.199.108.153", RecordType:"A", HostName:"@"}, {Address:"185.199.109.153", RecordType:"A", HostName:"@"}, {Address:"185.199.110.153", RecordType:"A", HostName:"@"}, {Address:"185.199.111.153", RecordType:"A", HostName:"@"});
  if (!(await X(`Setting ${L(`${e.length}`, "yellow")} host records`, async() => await a.dns.setHosts(b, e))).IsSuccess) {
    throw Error("Operation wasn't successful.");
  }
}
;const qd = async a => await new Promise((b, c) => {
  gb(a, d => {
    d && "ENOENT" == d.code ? b(!1) : d ? c(d) : b(!0);
  });
});
async function rd(a, b, c) {
  a = await Ab(a, c);
  await G(b, a, {space:2});
  return a;
}
;async function sd(a, b = {}, c = {}) {
  if ("string" != typeof a) {
    throw Error("Package name is required.");
  }
  const {homedir:d = w(), rcNameFunction:e = l => `.${l}rc`, force:f = !1, local:g = !1, questionsTimeout:h} = c;
  var k = e(a);
  a = Zc(d, k);
  c = await qd(a);
  if (g) {
    k = Zc(k);
    const l = await qd(k);
    return await td(c, l, a, k, b, h, f);
  }
  return await ud(c, a, b, h, f);
}
const ud = async(a, b, c, d, e) => a ? await vd(b, c, e, d) : await rd(c, b, d), vd = async(a, b, c, d) => {
  const e = await G(a);
  return c ? await wd(b, a, e, d) : e;
}, td = async(a, b, c, d, e, f, g) => b ? await vd(d, e, g, f) : (a = a ? await G(c) : {}, await wd(e, d, a, f)), wd = async(a, b, c, d) => {
  a = xd(a, c);
  return await rd(a, b, d);
}, xd = (a, b) => Object.keys(a).reduce((c, d) => {
  const e = b[d];
  return {...c, [d]:{...a[d], ...e ? {defaultValue:e} : {}}};
}, {});
var yd = {ApiUser:{text:"Username", validation:a => {
  if (!a) {
    throw Error("Please enter the namecheap username.");
  }
}}, ApiKey:{text:"Api key https://ap.www.namecheap.com/settings/tools/apiaccess/", validation:a => {
  if (!a) {
    throw Error("Please provide the namecheap api key.");
  }
}}, ClientIp:{text:"Client ip", getDefault:O.LOOKUP_IP}, phone:{text:"Last 3 digit of phone to use for 2 factor auth"}};
const zd = q("expensive"), Ad = async() => {
  const a = Nc(Y);
  zd("Reading %s rc", a);
  const {ApiUser:b, ApiKey:c, ClientIp:d, phone:e} = await sd(a, yd);
  if (!b) {
    throw Error("Api User is missing");
  }
  if (!c) {
    throw Error("Api Key is missing");
  }
  return {ApiUser:b, ApiKey:c, ClientIp:d, phone:e};
};
const Bd = q("expensive"), Cd = async(a, b, c) => {
  c = c || await O.LOOKUP_IP();
  const d = await Bb({text:`Enter the password to white-list ${c}`, validation(f) {
    if (!f) {
      throw Error("Please enter the password.");
    }
  }, password:!0}), e = new O({sandbox:b});
  await e.auth(a.ApiUser, d, a.phone);
  await e.whitelistIP(c);
  b = Nc(b);
  b = Yc(w(), `.${b}rc`);
  Bd("Writing to %s", b);
  await G(b, {...a, ClientIp:c});
};
var Dd = {1:"Requesting white-listing of the IP address.", 1011150:"Parameter RequestIP is invalid", 2030166:"Domain is invalid", 2011170:"PromotionCode is invalid"};
const Ed = a => [["Domain Name", "name", "string", (b, c) => `${b}: ${c}`], ["Registrar URL", "url", "string", (b, c) => `${b}: ${c}`], ["Updated Date", "updated", "date", (b, c, d) => `${b}: ${c} (${d} ${1 == d ? "day" : "days"} ago)`], ["Creation Date", "created", "date", (b, c, d) => `${b}: ${c} (${d} ${1 == d ? "day" : "days"} ago)`], ["Registry Expiry Date", "expire", "date", (b, c, d) => `${b}: ${c} (in ${-d} ${1 == -d ? "day" : "days"})`], ["Name Server", "ns", "array", (b, c) => `${b}: ${c}`]].reduce((b, 
[c, d, e, f]) => {
  try {
    const h = "date" == e;
    e = "array" == e;
    const k = new RegExp(`^${c}: (.+)`, "mg"), l = [];
    let m;
    for (; null !== (m = k.exec(a));) {
      const [, t] = m;
      l.push(h ? new Date(t) : t);
    }
    const n = e ? l.join("\n ") : l[0], p = f(c, h ? n.toLocaleString() : n, h ? Math.round(((new Date).getTime() - n.getTime()) / 864E5) : null);
    var g = {[d]:p};
  } catch (h) {
    g = {};
  }
  return {...b, ...g};
}, {});
var Fd = async() => {
  var a = await O.WHOIS(T);
  if (nc) {
    return console.log(a);
  }
  a = Ed(a);
  Object.values(a).forEach(b => console.log(b));
};
const Gd = async() => {
  await sd(Nc(Y), yd, {force:!0});
};
async function Hd(a, b) {
  const [c, d] = await Promise.all([a.domains.getInfo(b), a.dns.getHosts(b)]);
  {
    const {DomainDetails:e, Whoisguard:f, DnsDetails:g} = c;
    a = [{name:"Created:", value:e.CreatedDate}, {name:"Expires on:", value:e.ExpiredDate}, {name:"Whois enabled:", value:f.Enabled}, ...f.EmailDetails ? [{name:"Whois email:", value:f.EmailDetails.ForwardedTo}] : [], {name:"DNS:", value:"FREE" == c.DnsDetails.ProviderType ? L(g.ProviderType, "green") : g.ProviderType}, {name:"Nameservers:", value:g.Nameserver.join(", ")}, {name:"Created:", value:e.CreatedDate}];
    a = V({data:a, keys:["name", "value"]});
    [, ...a] = a.split("\n");
    a = a.join("\n");
    console.log(a);
  }
  d.IsUsingOurDNS && (console.log(), console.log(V({headings:["Name", "Type", "Address"], data:d.hosts, keys:["Name", "Type", "Address"]})));
}
;async function Id() {
  const a = await (Y ? O.SANDBOX_COUPON() : O.COUPON());
  console.log(a);
}
;const Jd = require("../../package.json").version, Y = pc || !!process.env.SANDBOX, Z = q("expensive"), Kd = /expensive/.test(process.env.NODE_DEBUG);
if (rc) {
  console.log(Jd), process.exit();
} else {
  if (sc) {
    var Ld;
    {
      const a = P({usage:R(hc), description:L("expensive", "yellow") + "\nA CLI application to access namecheap.com domain name registrar API."}), b = P({usage:{}, description:L("expensive domain.com --info", "magenta") + "\nDisplay the information about the domain on the account.\nAlso displays DNS hosts if using Namecheap's DNS."}).trim() + "\n", c = P({description:L("expensive", "red") + "\nPrint the list of domains belonging to the account.", usage:R(xc)}), d = P({description:L("expensive domain.com -r [-p PROMO]", 
      "green") + "\nRegister the domain name. Expensive will attempt to find the promo\ncode online, and compare its price to the normal price.", usage:R(Dc)}), e = P({description:L("expensive domain|domain.com [domain.org] [-f] [-z app,page]", "blue") + `
Check domains for availability. When no TLD is given,
${Oc} are checked.`, usage:R(tc)});
      Ld = [a, b, c, d, e].join("\n");
    }
    console.log(Ld);
    process.exit();
  }
}
const Nd = async(a, b = !1) => {
  try {
    if (qc) {
      return await Cd(a, b);
    }
    var c = a.ClientIp || await O.LOOKUP_IP();
    const d = new cb({user:a.ApiUser, key:a.ApiKey, ip:c, sandbox:b});
    if (!T) {
      return await Vc(d, {sort:yc, desc:zc, filter:Ac, type:Cc, pageSize:Bc});
    }
    [c] = T;
    if (lc) {
      return await pd(d, c);
    }
    if (jc) {
      return await Hd(d, c);
    }
    if (kc) {
      return await nd(d, {domain:c, promo:Fc, sandbox:b, years:Gc});
    }
    await $c(d);
  } catch (d) {
    await Md(d, a, b);
  }
}, Md = async({stack:a, message:b, f:c}, d, e) => {
  c && (Z(aa(c, {colors:!0})), Z(Dd[c.Number]));
  if (c && 1011150 == c.Number) {
    try {
      const [, f] = /Invalid request IP: (.+)/.exec(b) || [];
      await Cd(d, e, f);
    } catch ({message:f, stack:g}) {
      console.log("Could not white-list IP."), Kd ? Z(g) : console.error(f), process.exit(1);
    }
    return Nd(d, e);
  }
  Kd ? Z(a) : console.error(b);
  process.exit(1);
};
(async() => {
  try {
    if (oc) {
      return await Id();
    }
    if (mc || nc) {
      return await Fd();
    }
    if (ic) {
      return await Gd();
    }
  } catch (b) {
    const {stack:c, message:d} = b;
    Kd ? Z(c) : console.error(d);
    return;
  }
  const a = await Ad();
  await Nd(a, Y);
})();


//# sourceMappingURL=expensive.js.map