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
const {createGunzip:ra} = zlib;
const sa = a => {
  ({"content-encoding":a} = a.headers);
  return "gzip" == a;
}, ta = (a, b, c = {}) => {
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
        var v = sa(r);
        r.on("data", K => m += K.byteLength);
        r = v ? r.pipe(ra()) : r;
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
const ua = (a = {}) => Object.keys(a).reduce((b, c) => {
  const d = a[c];
  c = `${encodeURIComponent(c)}=${encodeURIComponent(d)}`;
  return [...b, c];
}, []).join("&").replace(/%20/g, "+"), ya = async(a, b, {data:c, justHeaders:d, binary:e, i:f = y(!0)}) => {
  const {H:g, j:h} = ta(a, b, {justHeaders:d, binary:e, i:f});
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
        v = ua(v), x = "application/x-www-form-urlencoded";
    }
    v = {data:v, contentType:x};
    ({data:x} = v);
    ({contentType:v} = v);
    u.method = k || "POST";
    "Content-Type" in u.headers || (u.headers["Content-Type"] = v);
    "Content-Length" in u.headers || (u.headers["Content-Length"] = Buffer.byteLength(x));
  }
  !f || "Accept-Encoding" in u.headers || (u.headers["Accept-Encoding"] = "gzip, deflate");
  const {body:K, headers:G, byteLength:va, statusCode:yb, statusMessage:zb, G:wa, w:xa} = await ya(r, u, {data:x, justHeaders:h, binary:g, i:b});
  za("%s %s B%s", a, va, `${va != wa ? ` (raw ${wa} B)` : ""}`);
  return {body:xa ? xa : K, headers:G, statusCode:yb, statusMessage:zb};
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
  b = D(g, "Registrant");
  const t = D(h, "Tech"), r = D(k, "Admin"), u = D(l, "AuxBilling");
  a = await a("namecheap.domains.create", {DomainName:c, Years:d, PromotionCode:e, ...b, ...t, ...r, ...u, Nameservers:m.join(","), AddFreeWhoisguard:n ? "yes" : "no", WGEnabled:n ? "yes" : "no", ...p}, "POST");
  [{f:a}] = C("DomainCreateResult", a);
  return a;
}
const Sa = "JobTitle FirstName LastName Address1 Address2 City StateProvince StateProvinceChoice Country Phone PhoneExt Fax EmailAddress".split(" "), D = (a, b) => Sa.reduce((c, d) => ({...c, [`${b}${d}`]:"StateProvince" != d || a[d] ? a[d] : "NA"}), {[`${b}OrganizationName`]:a.Organization, [`${b}PostalCode`]:a.Zip});
async function Ta(a, {I:b, J:c}) {
  a = await a("namecheap.domains.dns.getHosts", {SLD:b, TLD:c});
  const [{content:d, f:e}] = C("DomainDNSGetHostsResult", a);
  a = Ua(d, "Host");
  b = Ua(d, "host");
  c = Ua(d, "HOST");
  a = [...a, ...b, ...c];
  return {...e, hosts:a};
}
const Ua = (a, b) => C(b, a).map(({f:c}) => c);
async function Va(a, b, c) {
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
;async function Wa(a) {
  a = await a("namecheap.users.address.getList");
  [{content:a}] = C("AddressGetListResult", a);
  return C("List", a).map(({f:b}) => b);
}
;const Xa = q("expensive");
async function Ya(a, b) {
  a = await a("namecheap.users.address.getInfo", {AddressId:b});
  [{content:a}] = C("GetAddressInfoResult", a);
  return Za(a);
}
const $a = "AddressId UserName AddressName Default_YN FirstName LastName JobTitle Organization Address1 Address2 City StateProvince StateProvinceChoice Zip Country Phone PhoneExt EmailAddress".split(" "), Za = a => $a.reduce((b, c) => {
  try {
    let [{content:d}] = C(c, a);
    "Default_YN" == c ? d = "true" == d : "AddressId" == c && (d = parseInt(d, 10));
    return {...b, [c]:d};
  } catch (d) {
    return Xa(`Could not extract tag ${c}`), b;
  }
}, {});
const bb = async(a, b) => {
  const {type:c, category:d, promoCode:e, action:f, product:g} = b;
  a = await a("namecheap.users.getPricing", {ProductType:c, ProductCategory:d, PromotionCode:e, ActionName:f, ProductName:g});
  return C("ProductType", a).reduce((h, {content:k, f:{Name:l}}) => {
    k = ab(k);
    h[l] = k;
    return h;
  }, {});
}, ab = a => C("ProductCategory", a).reduce((b, {content:c, f:{Name:d}}) => {
  c = cb(c);
  b[d] = c;
  return b;
}, {}), cb = a => C("Product", a).reduce((b, {content:c, f:{Name:d}}) => {
  c = C("Price", c).map(({f:e}) => e);
  d = d.replace(/-(.)/g, (e, f) => f.toUpperCase());
  b[d] = c;
  return b;
}, {});
class db {
  constructor(a) {
    const {user:b, key:c, sandbox:d = !1, ip:e} = a;
    this.u = b;
    this.o = c;
    this.b = `https://api.${d ? "sandbox." : ""}namecheap.com`;
    this.g = e;
    const f = this.s.bind(this);
    this.users = {async getPricing(g) {
      return await bb(f, g);
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
      return await Wa(f);
    }, async getInfo(g) {
      return await Ya(f, g);
    }};
    this.dns = {async getHosts(g) {
      const [h, ...k] = g.split(".");
      g = k.join(".");
      return await Ta(f, {I:h, J:g});
    }, async setHosts(g, h, k = {}) {
      const [l, ...m] = g.split(".");
      g = m.join(".");
      return await Va(f, {SLD:l, TLD:g, ...k}, h);
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
;const {createReadStream:eb, createWriteStream:fb, existsSync:gb, stat:hb} = fs;
async function ib(a) {
  a = eb(a);
  return await qa(a);
}
;async function jb(a, b) {
  if (!a) {
    throw Error("No path is given.");
  }
  const c = y(!0), d = fb(a);
  await new Promise((e, f) => {
    d.on("error", g => {
      g = c(g);
      f(g);
    }).on("close", e).end(b);
  });
}
;const kb = q("bosom"), lb = async(a, b, c) => {
  const {replacer:d = null, space:e = null} = c;
  b = JSON.stringify(b, d, e);
  await jb(a, b);
}, E = async(a, b, c = {}) => {
  if (b) {
    return await lb(a, b, c);
  }
  kb("Reading %s", a);
  a = await ib(a);
  return JSON.parse(a);
};
const mb = async(a, b = {}) => {
  ({body:a} = await A(a, b));
  return a;
};
async function F(a, b, c = {}) {
  {
    const {headers:d = {}, ...e} = c;
    c = {...e, headers:{...a.headers, ...d, Cookie:a.Cookie}};
  }
  b = await A(a.host ? `${a.host}${b}` : b, c);
  ({headers:c} = b);
  a.cookies = nb(a.cookies, c);
  return b;
}
class ob {
  constructor(a = {}) {
    const {host:b, headers:c = {}} = a;
    this.host = b;
    this.headers = c;
    this.cookies = {};
  }
  async rqt(a, b = {}) {
    ({body:a} = await F(this, a, b));
    return a;
  }
  async bqt(a, b = {}) {
    ({body:a} = await F(this, a, {...b, binary:!0}));
    return a;
  }
  async jqt(a, b = {}) {
    ({body:a} = await F(this, a, b));
    return a;
  }
  async aqt(a, b = {}) {
    return await F(this, a, b);
  }
  get Cookie() {
    return pb(this.cookies);
  }
}
const pb = a => Object.keys(a).reduce((b, c) => {
  c = `${c}=${a[c]}`;
  return [...b, c];
}, []).join("; "), nb = (a, b) => {
  b = qb(b);
  const c = {...a, ...b};
  return Object.keys(c).reduce((d, e) => {
    const f = c[e];
    return f ? {...d, [e]:f} : d;
  }, {});
}, qb = ({"set-cookie":a = []} = {}) => a.reduce((b, c) => {
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
async function rb() {
  const {host:a = "https://api.ipify.org"} = {};
  return await mb(a);
}
;const {ok:H} = assert;
const {createInterface:sb} = readline;
function tb(a, b, c) {
  return setTimeout(() => {
    const d = Error(`${a ? a : "Promise"} has timed out after ${b}ms`);
    d.stack = `Error: ${d.message}`;
    c(d);
  }, b);
}
function ub(a, b) {
  let c;
  const d = new Promise((e, f) => {
    c = tb(a, b, f);
  });
  return {timeout:c, j:d};
}
async function vb(a, b, c) {
  if (!(a instanceof Promise)) {
    throw Error("Promise expected");
  }
  if (!b) {
    throw Error("Timeout must be a number");
  }
  if (0 > b) {
    throw Error("Timeout cannot be negative");
  }
  const {j:d, timeout:e} = ub(c, b);
  try {
    return await Promise.race([a, d]);
  } finally {
    clearTimeout(e);
  }
}
;function wb(a, b = {}) {
  const {timeout:c, password:d = !1, output:e = process.stdout, input:f = process.stdin, ...g} = b;
  b = sb({input:f, output:e, ...g});
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
  h = c ? vb(h, c, `reloquent: ${a}`) : h;
  b.promise = xb(h, b);
  return b;
}
const xb = async(a, b) => {
  try {
    return await a;
  } finally {
    b.close();
  }
};
async function Ab(a, b) {
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
    ({promise:g} = wb(`${e.text}${h ? `[${h}] ` : ""}${g ? `[${g}] ` : ""}`, {timeout:b, password:e.password}));
    f = await g || f || e.defaultValue;
    "function" == typeof e.validation && e.validation(f);
    "function" == typeof e.postProcess && (f = await e.postProcess(f));
    return {...c, [d]:f};
  }, {});
}
;async function Bb(a, b) {
  return await Ab(a, b);
}
async function Cb(a) {
  ({question:a} = await Ab({question:a}, void 0));
  return a;
}
async function I(a, b = {}) {
  const {defaultYes:c = !0, timeout:d} = b;
  b = a.endsWith("?");
  ({question:a} = await Ab({question:{text:`${b ? a.replace(/\?$/, "") : a} (y/n)${b ? "?" : ""}`, defaultValue:c ? "y" : "n"}}, d));
  return "y" == a;
}
;/*
 diff package https://github.com/kpdecker/jsdiff
 BSD License
 Copyright (c) 2009-2015, Kevin Decker <kpdecker@gmail.com>
*/
const Db = {black:30, red:31, green:32, yellow:33, blue:34, magenta:35, cyan:36, white:37, grey:90}, Eb = {black:40, red:41, green:42, yellow:43, blue:44, magenta:45, cyan:46, white:47};
function J(a, b) {
  return (b = Db[b]) ? `\x1b[${b}m${a}\x1b[0m` : a;
}
function Fb(a) {
  const b = Eb.green;
  return b ? `\x1b[${b}m${a}\x1b[0m` : a;
}
;const Gb = a => B(/<input type="hidden" name="(.+?)" id="__\w+" value="(.*?)" \/>/g, a, ["name", "value"]).reduce((b, {name:c, value:d}) => ({...b, [c]:d}), {}), Hb = a => {
  const b = /(.+?)(\d\d\d)$/.exec(a);
  if (!b) {
    return a;
  }
  const [, c, d] = b;
  return `${J(c, "grey")}${d}`;
}, Ib = a => a.map(({title:b}) => ` ${b}`).map(Hb).join("\n"), Jb = async(a, b) => {
  var c = `Which phone number to use for 2 factor auth
${Ib(a)}
enter last 3 digits`;
  const d = await Cb({text:c, async getDefault() {
    return b || a[0].last;
  }, validation(e) {
    if (!a.some(({last:f}) => f == e)) {
      throw Error("Unknown number entered.");
    }
  }});
  ({value:c} = a.find(({last:e}) => e == d));
  return c;
}, Kb = (a, b) => {
  var c = Object.keys(a).reduce((d, e) => {
    var f = a[e];
    const g = b[e];
    return e in b ? f !== g ? (f = J(`${`-  ${e}`}: ${f}`, "red"), e = J(`${`+  ${e}`}: ${g}`, "green"), [...d, f, e]) : d : (e = J(`${`-  ${e}`}: ${f}`, "red"), [...d, e]);
  }, []);
  c = Object.keys(b).reduce((d, e) => {
    const f = a[e];
    return e in a ? d : (e = J(`${`+  ${e}`}: ${f}`, "green"), [...d, e]);
  }, c);
  if (c.length) {
    throw c = `
{
${c.join("\n")}
}`.trim(), Error(c);
  }
};
const Lb = q("@rqt/namecheap-web");
async function Mb(a) {
  const {SessionKey:b} = await a.session.jqt("/cart/ajax/SessionHandler.ashx");
  if (!b) {
    throw Error(`Could not acquire the session key from ${a.session.host}${"/cart/ajax/SessionHandler.ashx"}.`);
  }
  Lb("Obtained a session key %s", b);
  a.b = b;
}
async function Nb(a, b = !1) {
  var c = await a.session.rqt(L.b);
  H(/Select Phone Contact Number/.test(c), 'Could not find the "Select Phone" section.');
  var d = B(/<option value="(\d+-phone)">(.+?(\d\d\d))<\/option>/g, c, ["value", "title", "last"]);
  H(d.length, "Could not find any numbers.");
  d = await Jb(d, a.s);
  c = await a.session.rqt(L.b, {data:{...Gb(c), ctl00$ctl00$ctl00$ctl00$base_content$web_base_content$home_content$page_content_left$CntrlAuthorization$ddlAuthorizeList:d, ctl00$ctl00$ctl00$ctl00$base_content$web_base_content$home_content$page_content_left$CntrlAuthorization$btnSendVerification:"Proceed with Login"}, type:"form"});
  if (/You have reached the limit on the number.+/m.test(c)) {
    throw Error(c.match(/You have reached the limit on the number.+/m)[0]);
  }
  d = /Error occured during Two-Factor authentication provider call./m.test(c);
  if (!b && d) {
    return console.log("Received an error message: Error occured during Two-Factor authentication provider call."), console.log("Retrying to get the code, if you get 2 messages, dismiss the first one."), await Nb(a, !0);
  }
  if (b && d) {
    throw Error("Error occured during Two-Factor authentication provider call.");
  }
  H(/We sent a message with the verification code/.test(c), "Could not find the code entry section.");
  await Ob(a, c);
}
async function Pb(a) {
  const {body:b, statusCode:c, headers:{location:d}} = await a.session.aqt(L.g, {data:{hidden_LoginPassword:"", LoginUserName:a.u, LoginPassword:a.o, sessionEncryptValue:a.b}, type:"form"});
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
  if (302 == c && d.includes(L.b)) {
    await Nb(a);
  } else {
    throw Error(`Unknown result (status code ${c})`);
  }
  ({cookies:a} = a.session);
  return a;
}
async function Ob(a, b) {
  var [, c] = /Your 6-digit code begins with (\d)./.exec(b) || [];
  if (!c) {
    throw Error("Could not send the code.");
  }
  c = await Cb({text:`Security code (begins with ${c})`});
  const {body:d, headers:{location:e}} = await a.session.aqt(L.b, {data:{...Gb(b), ctl00$ctl00$ctl00$ctl00$base_content$web_base_content$home_content$page_content_left$CntrlAuthorization$txtAuthVerification:c, ctl00$ctl00$ctl00$ctl00$base_content$web_base_content$home_content$page_content_left$CntrlAuthorization$btnVerify:"Submit Security Code"}, type:"form"});
  if (/Oops, you entered an invalid code.+/m.test(d)) {
    return console.log("Incorrect code, try again."), await Ob(a, d);
  }
  H(/Object moved/.test(d), "Expected to have been redirected after sign-in.");
  return e;
}
class L {
  constructor({username:a, password:b, phone:c, host:d, userAgent:e} = {}) {
    d = new ob({host:d, headers:{"User-Agent":e}});
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
;const Qb = a => {
  if (a.__isError) {
    var b = Error(a.Message);
    Object.assign(b, a);
    throw b;
  }
  if (!a.Success) {
    throw b = a.Errors.map(({Message:c}) => c).join(", "), b = Error(b), b.__type = a.__type, b;
  }
};
function Rb(a) {
  return `/api/v1/ncpl/apiaccess/ui/${a}`;
}
async function Sb(a) {
  ({statusCode:a} = await a.session.aqt("/", {justHeaders:!0}));
  return 200 == a;
}
async function Tb(a) {
  a = await a.session.rqt(Ub.b);
  a = /<input type="hidden" id="x-ncpl-csrfvalue" value="(.+?)"/.exec(a);
  if (!a) {
    throw Error("Could not find the x-ncpl-csrfvalue token on the page.");
  }
  [, a] = a;
  return a;
}
async function Vb(a, b, c = `@rqt ${(new Date).toLocaleString()}`.replace(/:/g, "-")) {
  const d = await Tb(a);
  await a.request(Rb("AddIpAddress"), d, {accountPassword:a.password, ipAddress:b, name:c});
}
async function Wb(a, b) {
  const c = await Tb(a);
  await a.request(Rb("RemoveIpAddresses"), c, {accountPassword:a.password, names:[b]});
}
async function Xb(a) {
  const b = await Tb(a);
  ({IpAddresses:a} = await a.request(Rb("GetWhitelistedIpAddresses"), b));
  return a.map(({Name:c, IpAddress:d, ModifyDate:e}) => ({Name:c, IpAddress:d, ModifyDate:new Date(`${e}Z`)}));
}
class Ub {
  constructor({cookies:a, host:b, userAgent:c, password:d}) {
    b = new ob({host:b, headers:{"User-Agent":c}});
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
    Qb(a);
    ({Data:a} = a);
    return a;
  }
}
;const Yb = async a => {
  var b = new ob({host:"https://www.namecheap.com/domains/whois", headers:{"User-Agent":"Mozilla/5.0 (Node.js; @rqt/namecheap-web) https://github.com/rqt/namecheap-web"}});
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
const Zb = async(a = !1) => {
  a = await mb(`https://www.${a ? "sandbox." : ""}namecheap.com/promos/coupons/`, {headers:{"User-Agent":"Mozilla/5.0 (Node.js; @rqt/namecheap-web) https://github.com/rqt/namecheap-web"}});
  a = /<small>Coupon Code<\/small>\s+.+couponCode">(.+)<\/span>/.exec(a);
  if (!a) {
    throw Error("Could not find the coupon code.");
  }
  return a[1];
};
const $b = q("@rqt/namecheap-web"), ac = (a = !1) => `https://www.${a ? "sandbox." : ""}namecheap.com`, bc = (a = !1) => `https://ap.www.${a ? "sandbox." : ""}namecheap.com`;
async function cc(a, b) {
  a.g.readSession && await dc(b, a.g.sessionFile);
}
async function M(a, b) {
  const c = ec(a.b.session.cookies);
  b = await b;
  const d = ec(a.b.session.cookies);
  try {
    Kb(c, d);
  } catch ({message:e}) {
    $b(e), await cc(a, d);
  }
  return b;
}
class N {
  constructor(a = {}) {
    const {sandbox:b, readSession:c, sessionFile:d = ".namecheap-web.json"} = a;
    this.g = {sandbox:b, readSession:c, sessionFile:d};
    this.b = null;
  }
  static async["LOOKUP_IP"]() {
    return await rb();
  }
  static async["WHOIS"](a) {
    return Yb(a);
  }
  static async["COUPON"]() {
    return Zb();
  }
  static async["SANDBOX_COUPON"]() {
    return Zb(!0);
  }
  async auth(a, b, c, d = !1) {
    var e;
    this.g.readSession && !d && (e = await fc(this.g.sessionFile));
    e || (e = new L({username:a, password:b, host:ac(this.g.sandbox), phone:c, userAgent:"Mozilla/5.0 (Node.js; @rqt/namecheap-web) https://github.com/rqt/namecheap-web"}), await Mb(e), e = await Pb(e), await cc(this, e));
    this.b = new Ub({cookies:e, password:b, host:bc(this.g.sandbox), userAgent:"Mozilla/5.0 (Node.js; @rqt/namecheap-web) https://github.com/rqt/namecheap-web"});
    e = await M(this, Sb(this.b));
    if (!e && d) {
      throw Error("Could not authenticate.");
    }
    e || await this.auth(a, b, c, !0);
  }
  async whitelistIP(a, b) {
    await M(this, Vb(this.b, a, b));
  }
  async getWhitelistedIPList() {
    return await M(this, Xb(this.b));
  }
  async removeWhitelistedIP(a) {
    await M(this, Wb(this.b, a));
  }
}
const ec = a => {
  const b = ["x-ncpl-auth", ".ncauth", "SessionId", "U"];
  return Object.keys(a).reduce((c, d) => b.includes(d) ? {...c, [d]:a[d]} : c, {});
}, fc = async a => {
  try {
    return await E(a);
  } catch (b) {
    return null;
  }
}, dc = async(a, b) => {
  await E(b, a);
};
function O(a = {usage:{}}) {
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
;const gc = (a, b, c, d = !1, e = !1) => {
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
function P(a = {}, b = process.argv) {
  [, , ...b] = b;
  const c = hc(b);
  b = b.slice(c.length);
  let d = !c.length;
  return Object.keys(a).reduce(({h:e, ...f}, g) => {
    if (0 == e.length && d) {
      return {h:e, ...f};
    }
    const h = a[g];
    let k;
    if ("string" == typeof h) {
      ({value:k, argv:e} = gc(e, g, h));
    } else {
      try {
        const {short:l, boolean:m, number:n, command:p, multiple:t} = h;
        p && t && c.length ? (k = c, d = !0) : p && c.length ? (k = c[0], d = !0) : {value:k, argv:e} = gc(e, g, l, m, n);
      } catch (l) {
        return {h:e, ...f};
      }
    }
    return void 0 === k ? {h:e, ...f} : {h:e, ...f, [g]:k};
  }, {h:b});
}
const hc = a => {
  const b = [];
  for (let c = 0; c < a.length; c++) {
    const d = a[c];
    if (d.startsWith("-")) {
      break;
    }
    b.push(d);
  }
  return b;
}, Q = a => Object.keys(a).reduce((b, c) => {
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
const ic = {domains:{description:"The domain name for operations, or multiple domain names\nfor checking availability.", command:!0, multiple:!0}, init:{description:"Initialise package configuration interactively, i.e.,\nthe API key and ip address.", boolean:!0, short:"I"}, info:{description:"Show the information for the domain.", boolean:!0, short:"i"}, register:{description:"Register the domain.", boolean:!0, short:"r"}, whois:{description:"Display brief WHOIS data.", boolean:!0, short:"w"}, Whois:{description:"Display full WHOIS data.", 
boolean:!0}, coupon:{description:"Find this month's coupon.", boolean:!0}, sandbox:{description:"Use the sandbox API.", boolean:!0, short:"s"}, whitelistIP:{description:"Add current IP address to the list of white-listed ones.", boolean:!0, short:"W"}, version:{description:"Display the current version number.", boolean:!0, short:"v"}, help:{description:"Show help information.", boolean:!0, short:"h"}}, R = P(ic), S = R.domains, jc = R.init, kc = R.info, lc = R.register, mc = R.whois, nc = R.Whois, 
oc = R.coupon, pc = R.sandbox, qc = R.whitelistIP, rc = R.version, sc = R.help, tc = {free:{description:"Display only free domains.", boolean:!0, short:"f"}, zones:{description:"Check in these zones only.", short:"z"}}, uc = P(tc, [process.argv[0], process.argv[1], ...R.h]), vc = uc.free, wc = uc.zones, T = P({record:{description:"The record type. Can be one of the following:\n`A`, `AAAA`, `ALIAS`, `CAA`, `CNAME`, `MX`, `MXE`,\n`NS`, `TXT`, `URL`, `URL301`, `FRAME`."}, TXT:{description:"Add a TXT record with this address to the domain.\nAlias for `--type TXT --address <TXT>`."}, 
CNAME:{description:"Add a CNAME record with this address to the domain.\n`--type CNAME --address <CNAME>`."}, ttl:{description:"When adding host records, sets the _TTL_.\nBy default, namecheap sets 1800."}, host:{description:"The host name for adding dns records.", default:"@"}, address:{description:"The address of the new host record."}, mxpref:{description:"MX preference for hosts. Applicable to MX records only."}, github:{description:"Setup GitHub pages for the apex domain as per docs\nhttps://git.io/fjyr7 Also removes the parking page\nand URL redirect. All other hosts are kept itact.", 
boolean:!0, short:"g"}, "delete":{description:"Remove the specified host record.", boolean:!0}}, [process.argv[0], process.argv[1], ...uc.h]), xc = T.record, yc = T.TXT, zc = T.CNAME, Ac = T.ttl, Bc = T.host || "@", Cc = T.address, Dc = T.mxpref, Ec = T.github, Fc = T["delete"], Gc = {sort:{description:"Sort by this field (name, expire, create).", short:"S"}, desc:{description:"Sort in descending order.", boolean:!0, short:"D"}, filter:{description:"Filter by this word.", short:"F"}, pageSize:{description:"The page size.", 
short:"P"}, type:{description:"Domain type (ALL, EXPIRING, EXPIRED).", short:"T"}}, U = P(Gc, [process.argv[0], process.argv[1], ...T.h]), Hc = U.sort, Ic = U.desc, Jc = U.filter, Kc = U.pageSize, Lc = U.type, Mc = {promo:{description:"Use this promo code on registration.", short:"p"}, years:{description:"The number of years that the domain should be registered for.", short:"y"}}, Nc = P(Mc, [process.argv[0], process.argv[1], ...U.h]), Oc = Nc.promo, Pc = Nc.years;
const Qc = "com net org biz co cc io bz nu app page".split(" "), Rc = (a, b) => (b.length ? Qc.filter(c => b.includes(c)) : Qc).map(c => `${a}.${c}`), Sc = J("\u2713", "green"), Tc = J("-", "grey"), Uc = a => a.map(b => {
  const {Created:c, Expires:d, IsOurDNS:e} = b, f = Date.parse(c), g = Date.parse(d), h = (new Date).getTime();
  return {...b, Since:Math.round(Math.abs((h - f) / 864E5)), Expiry:Math.round(Math.abs((g - h) / 864E5)), Years:Math.abs((new Date(h - (new Date(f)).getTime())).getUTCFullYear() - 1970), DNS:e};
}), Vc = a => "ENABLED" == a ? {value:Sc, length:1} : "NOTPRESENT" == a ? {value:Tc, length:1} : {value:a, length:a.length}, Wc = a => a ? "expensive-sandbox" : "expensive";
const Xc = Qc.join(", ");
const Yc = a => ({value:`\x1b[1m${a}\x1b[0m`, length:a.length}), Zc = a => a.reduce((b, c) => ({...b, [c]:!0}), {});
function V(a) {
  const {keys:b = [], data:c = [], headings:d = {}, replacements:e = {}, centerValues:f = [], centerHeadings:g = []} = a;
  var [h] = c;
  if (!h) {
    return "";
  }
  const k = Zc(f);
  a = Zc(g);
  h = Object.keys(h).reduce((n, p) => {
    const t = d[p];
    return {...n, [p]:t ? t.length : p.length};
  }, {});
  const l = c.reduce((n, p) => Object.keys(p).reduce((t, r) => {
    const u = n[r], {length:x} = $c(e, r)(p[r]);
    return {...t, [r]:Math.max(x, u)};
  }, {}), h);
  h = b.reduce((n, p) => ({...n, [p]:d[p] || p}), {});
  const m = b.reduce((n, p) => ({...n, [p]:Yc}), {});
  a = ad(b, h, l, m, a);
  h = c.map(n => ad(b, n, l, e, k));
  return [a, ...h].join("\n");
}
const bd = (a, b, c, d) => {
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
}, $c = (a, b) => (a = a[b]) ? a : c => ({value:c, length:`${c}`.replace(/\033\[.*?m/g, "").length}), ad = (a, b, c, d = {}, e = {}) => {
  let f = 0;
  return a.map(g => {
    const h = c[g];
    if (!h) {
      throw Error(`Unknown field ${g}`);
    }
    var k = b[g];
    const l = $c(d, g), m = e[g], [n, ...p] = `${k}`.split("\n");
    g = bd(n, h, l, m);
    k = "";
    p.length && (k = "\n" + p.map(t => {
      const r = " ".repeat(f);
      t = bd(t, h, l, m);
      return `${r}${t}`;
    }).join("\n"));
    f += h + 2;
    return `${g}${k}`;
  }).join("  ");
};
function cd(a = []) {
  a.length ? (a = Uc(a), a = V({keys:["Name", "Expiry", "Years", "WhoisGuard", "DNS"], data:a, headings:{WhoisGuard:"Whois"}, replacements:{WhoisGuard:Vc, ["DNS"](b) {
    return b ? {value:"yes", length:3} : {value:"", length:0};
  }, ["Years"](b) {
    return b ? {value:b, length:`${b}`.length} : {value:"", length:0};
  }}, centerValues:["WhoisGuard"]}), console.log(a)) : console.log("No domains");
}
;async function dd(a, {sort:b, desc:c, page:d, filter:e, type:f, pageSize:g} = {}) {
  const {domains:h, ...k} = await a.domains.getList({page:d, sort:b, desc:c, filter:e, type:f, pageSize:g});
  cd(h);
  (d = ed(k)) && await I(`Page ${fd(k)}. Display more`) && await dd(a, {page:d, sort:b, desc:c, filter:e, type:f, pageSize:g});
}
const ed = ({CurrentPage:a, TotalItems:b, PageSize:c}) => {
  if (a * c < b) {
    return a + 1;
  }
}, fd = ({CurrentPage:a, TotalItems:b, PageSize:c}) => `${a}/${Math.ceil(b / c)}`;
const {join:gd, resolve:hd} = path;
const W = hd(w(), ".expensive.log");
async function id(a) {
  var {domains:b, D:c, M:d = ""} = {domains:S, M:wc, D:vc}, e = b.reduce((h, k) => /\./.test(k) ? [...h, k] : (k = Rc(k, d ? d.split(",") : []), [...h, ...k]), []);
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
  e = V({keys:["Domain", "Available", ...e ? ["IsPremiumName"] : [], ...g ? ["PremiumRegistrationPrice"] : []], data:a.map(h => ({...h, Available:h.Available ? J("yes", "green") : J("no", "red"), IsPremiumName:h.IsPremiumName ? J("\u2713", "green") : "", PremiumRegistrationPrice:h.PremiumRegistrationPrice ? parseFloat(h.PremiumRegistrationPrice).toFixed(2) : ""})), headings:{IsPremiumName:"Premium", PremiumRegistrationPrice:"Price"}, centerValues:["Available", "IsPremiumName"]});
  console.log(e);
  await jd(b.join(","), a);
}
const jd = async(a, b) => {
  gb(W) || await E(W, []);
  a = [...await E(W), {[a]:b.filter(({Available:c}) => c).map(({Domain:c}) => c)}];
  await E(W, a, {space:2});
};
const kd = (a, b) => {
  a = " ".repeat(Math.max(a - b.length, 0));
  return `${b}${a}`;
}, ld = a => {
  var {width:b} = {};
  a = a.split("\n");
  b = b || a.reduce((c, {length:d}) => d > c ? d : c, 0);
  return a.map(kd.bind(null, b)).join("\n");
};
function md(a) {
  const {padding:b = 1} = {};
  var c = a.split("\n").reduce((f, {length:g}) => g > f ? g : f, 0) + 2 * b;
  const d = `\u250c${"\u2500".repeat(c)}\u2510`;
  c = `\u2514${"\u2500".repeat(c)}\u2518`;
  const e = " ".repeat(b);
  a = ld(a).split("\n").map(f => `\u2502${e}${f}${e}\u2502`).join("\n");
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
const nd = a => (a = a.find(({IsDefault:b}) => b)) ? a.AddressId : null, od = async a => await (a ? N.SANDBOX_COUPON() : N.COUPON()), pd = a => {
  a = a.split(".");
  return a[a.length - 1];
}, qd = (a, b, c) => a.domains.register[b].find(({Duration:d}) => d == c), rd = async(a, b, c, d) => {
  const e = await a.users.getPricing({type:"DOMAIN", promoCode:d, action:"REGISTER", product:b});
  if (d) {
    var f = await a.users.getPricing({type:"DOMAIN", action:"REGISTER", product:b});
    ({YourPrice:f} = qd(f, b, c));
  }
  b = qd(e, b, c);
  return {m:d, AdditionalCost:b.YourAdditonalCost, Price:b.YourPrice, S:b.YourPriceType, N:b.YourAdditonalCostType, Currency:b.Currency, v:f};
}, sd = async(a, b, c) => {
  if (a) {
    return console.log("Using promo %s", a), a;
  }
  if (["com", "net", "org", "info", "biz"].includes(c)) {
    try {
      const d = await X("Checking coupon online", od(b));
      if (await I(`\rApply coupon ${d}?`)) {
        return d;
      }
    } catch (d) {
      console.log("Could not retrieve promo");
    }
  }
}, td = async({IsPremiumName:a, PremiumRegistrationPrice:b, EapFee:c}) => {
  let d = !0;
  a && (d = await I(`Continue with the premium registration price of ${b}?`, {defaultYes:!1}));
  parseFloat(c) && (d = d && await I(`Continue with the early access fee of ${c}?`, {defaultYes:!1}));
  if (!d) {
    throw Error("No confirmation.");
  }
}, ud = a => a.map(b => ({...b, value:`SKIP-${b.value}`})), vd = async(a, {F:b, years:c, promo:d, K:e}) => {
  const {IcannFee:f, PremiumRenewalPrice:g, PremiumTransferPrice:h, PremiumRegistrationPrice:k, IsPremiumName:l, EapFee:m} = a;
  a = await rd(b, e, c, d);
  b = [{name:"Premium Registration Price", value:k, l:k}, ...ud([{name:"Premium Renewal Price", value:g}, {name:"Premium Transfer Price", value:h}])];
  c = 0 != parseFloat(m);
  d = [{name:"Eap Fee", value:m, l:m}];
  c = [...l ? b : [], ...c ? d : []];
  d = [{name:"Price", value:a.Price, l:a.Price}, ...ud(a.m ? [{name:"Without Promo", value:a.v}] : []), ...f ? [{name:"Icann Fee", value:f}] : [], ...a.AdditionalCost ? [{name:"Additional Cost", value:`${a.AdditionalCost}`, l:a.AdditionalCost}] : []];
  b = (e = c.length) ? [...c, ...ud(d)] : d;
  c = (e ? c : d).reduce((n, {l:p = 0}) => n + parseFloat(p), 0);
  c = `${Number(c).toFixed(2)} ${a.Currency}`;
  c = [{name:"-----", value:"-".repeat(c.length)}, {name:"Total", value:c}];
  b = V({keys:["name", "value"], data:[...b, ...c], headings:["Price", "Value"], replacements:{value(n) {
    const [, p] = `${n}`.split("SKIP-");
    return p ? {value:J(p, "grey"), length:p.length} : {value:n, length:n.length};
  }}}).replace(/.+\n/, "");
  return {A:a, table:b};
};
async function wd(a, {domain:b, promo:c, sandbox:d, years:e = 1}) {
  const f = await X(`Confirming availability of ${b}`, async() => {
    const [v] = await a.domains.check(b);
    return v;
  }), {Available:g, EapFee:h, PremiumRegistrationPrice:k, Domain:l, IsPremiumName:m} = f;
  if (!g) {
    throw Error(`Domain ${l} is not available.`);
  }
  const n = pd(b), p = await sd(c, d, n), {A:t, table:r} = await X(`Getting ${e}-year price`, vd(f, {F:a, promo:p, years:e, K:n}));
  console.log("\n%s", r);
  t.m && parseFloat(t.Price) > parseFloat(t.v) && console.log("[!] Warning: you will pay more with coupon %s than without it.", t.m);
  console.log("");
  m && await td({IsPremiumName:m, PremiumRegistrationPrice:k, EapFee:h});
  const u = await X("Finding default address", async() => {
    var v = await a.address.getList();
    v = nd(v);
    if (!v) {
      throw Error("Could not find the default address.");
    }
    return await a.address.getInfo(v);
  });
  console.log("\rRegistering %s using:", Fb(b));
  xd(u);
  if (await I("OK?", {defaultYes:!1})) {
    var x;
    try {
      ({ChargedAmount:x} = await X("Registering the domain", async() => a.domains.create({address:u, domain:b, years:e, promo:p, ...m ? {premium:{P:!0, R:parseFloat(k), EapFee:parseFloat(h)}} : {}})));
    } catch (v) {
      const {f:K = {}, message:G} = v;
      ({Number:c} = K);
      2515610 == c ? (console.warn("[!] Bug: cannot register a premium with Eap."), console.warn(" -  Response when requesting w/out EapFee:"), console.log("    %s", G)) : /No free connections to registry./.test(G) ? (console.log("    %s", G), console.log("Please try again.")) : 3028166 == c && (console.warn("[!] Possible Bug (e.g., after sending without Eap)"), console.log("    %s", G));
      throw v;
    }
    console.log("Successfully registered %s! Charged amount: $%s.", J(b, "green"), Number(x).toFixed(2));
  }
}
const xd = ({FirstName:a, LastName:b, Address1:c, Address2:d, City:e, Zip:f, Country:g, EmailAddress:h}) => {
  a = md(`${a} ${b}, ${h}
 ${c}${d ? `\n ${d}` : ""}
 ${e}
 ${f}, ${g}`);
  console.log(a);
};
async function yd(a, b) {
  let {hosts:c, IsUsingOurDNS:d} = await a.dns.getHosts(b);
  if (!d) {
    throw Error(`Namecheap DNS is not being used for ${b}`);
  }
  c.reduce(async(f, {Type:g, Name:h, Address:k}) => {
    await f;
    "A" == g && "@" == h && (await I(`An A record at @ (${k}) already exists. Continue?`) || process.exit());
  }, {});
  c = c.filter(({Type:f, Name:g, Address:h}) => "www" == g && "CNAME" == f && "parkingpage.namecheap.com." == h || "@" == g && "URL" == f ? !1 : !0);
  const e = c.map(f => {
    const {TTL:g, Type:h, Address:k, Name:l, MXPref:m} = f;
    return {TTL:g, RecordType:h, Address:k, HostName:l, MXPref:m};
  });
  e.push({Address:"185.199.108.153", RecordType:"A", HostName:"@"}, {Address:"185.199.109.153", RecordType:"A", HostName:"@"}, {Address:"185.199.110.153", RecordType:"A", HostName:"@"}, {Address:"185.199.111.153", RecordType:"A", HostName:"@"});
  if (!(await X(`Setting ${J(`${e.length}`, "yellow")} host records`, async() => await a.dns.setHosts(b, e))).IsSuccess) {
    throw Error("Operation wasn't successful.");
  }
}
;const zd = async a => await new Promise((b, c) => {
  hb(a, d => {
    d && "ENOENT" == d.code ? b(!1) : d ? c(d) : b(!0);
  });
});
async function Ad(a, b, c) {
  a = await Bb(a, c);
  await E(b, a, {space:2});
  return a;
}
;async function Bd(a, b = {}, c = {}) {
  if ("string" != typeof a) {
    throw Error("Package name is required.");
  }
  const {homedir:d = w(), rcNameFunction:e = l => `.${l}rc`, force:f = !1, local:g = !1, questionsTimeout:h} = c;
  var k = e(a);
  a = hd(d, k);
  c = await zd(a);
  if (g) {
    k = hd(k);
    const l = await zd(k);
    return await Cd(c, l, a, k, b, h, f);
  }
  return await Dd(c, a, b, h, f);
}
const Dd = async(a, b, c, d, e) => a ? await Ed(b, c, e, d) : await Ad(c, b, d), Ed = async(a, b, c, d) => {
  const e = await E(a);
  return c ? await Fd(b, a, e, d) : e;
}, Cd = async(a, b, c, d, e, f, g) => b ? await Ed(d, e, g, f) : (a = a ? await E(c) : {}, await Fd(e, d, a, f)), Fd = async(a, b, c, d) => {
  a = Gd(a, c);
  return await Ad(a, b, d);
}, Gd = (a, b) => Object.keys(a).reduce((c, d) => {
  const e = b[d];
  return {...c, [d]:{...a[d], ...e ? {defaultValue:e} : {}}};
}, {});
var Hd = {ApiUser:{text:"Username", validation:a => {
  if (!a) {
    throw Error("Please enter the namecheap username.");
  }
}}, ApiKey:{text:"Api key https://ap.www.namecheap.com/settings/tools/apiaccess/", validation:a => {
  if (!a) {
    throw Error("Please provide the namecheap api key.");
  }
}}, ClientIp:{text:"Client ip", getDefault:N.LOOKUP_IP}, phone:{text:"Last 3 digit of phone to use for 2 factor auth"}};
const Id = q("expensive"), Jd = async() => {
  const a = Wc(Y);
  Id("Reading %s rc", a);
  const {ApiUser:b, ApiKey:c, ClientIp:d, phone:e} = await Bd(a, Hd);
  if (!b) {
    throw Error("Api User is missing");
  }
  if (!c) {
    throw Error("Api Key is missing");
  }
  return {ApiUser:b, ApiKey:c, ClientIp:d, phone:e};
};
const Kd = q("expensive"), Ld = async(a, b, c) => {
  c = c || await N.LOOKUP_IP();
  const d = await Cb({text:`Enter the password to white-list ${c}`, validation(f) {
    if (!f) {
      throw Error("Please enter the password.");
    }
  }, password:!0}), e = new N({sandbox:b});
  await e.auth(a.ApiUser, d, a.phone);
  await e.whitelistIP(c);
  b = Wc(b);
  b = gd(w(), `.${b}rc`);
  Kd("Writing to %s", b);
  await E(b, {...a, ClientIp:c});
};
var Md = {1:"Requesting white-listing of the IP address.", 1011150:"Parameter RequestIP is invalid", 2030166:"Domain is invalid", 2011170:"PromotionCode is invalid"};
const Nd = a => [["Domain Name", "name", "string", (b, c) => `${b}: ${c}`], ["Registrar URL", "url", "string", (b, c) => `${b}: ${c}`], ["Updated Date", "updated", "date", (b, c, d) => `${b}: ${c} (${d} ${1 == d ? "day" : "days"} ago)`], ["Creation Date", "created", "date", (b, c, d) => `${b}: ${c} (${d} ${1 == d ? "day" : "days"} ago)`], ["Registry Expiry Date", "expire", "date", (b, c, d) => `${b}: ${c} (in ${-d} ${1 == -d ? "day" : "days"})`], ["Name Server", "ns", "array", (b, c) => `${b}: ${c}`]].reduce((b, 
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
var Od = async() => {
  var a = await N.WHOIS(S);
  if (nc) {
    return console.log(a);
  }
  a = Nd(a);
  Object.values(a).forEach(b => console.log(b));
};
const Pd = async() => {
  await Bd(Wc(Y), Hd, {force:!0});
};
async function Qd(a, b) {
  const [c, d] = await Promise.all([a.domains.getInfo(b), a.dns.getHosts(b)]);
  {
    const {DomainDetails:e, Whoisguard:f, DnsDetails:g} = c;
    a = [{name:"Created:", value:e.CreatedDate}, {name:"Expires on:", value:e.ExpiredDate}, {name:"Whois enabled:", value:f.Enabled}, ...f.EmailDetails ? [{name:"Whois email:", value:f.EmailDetails.ForwardedTo}] : [], {name:"DNS:", value:"FREE" == c.DnsDetails.ProviderType ? J(g.ProviderType, "green") : g.ProviderType}, {name:"Nameservers:", value:g.Nameserver.join(", ")}, {name:"Created:", value:e.CreatedDate}];
    a = V({data:a, keys:["name", "value"]});
    [, ...a] = a.split("\n");
    a = a.join("\n");
    console.log(a);
  }
  d.IsUsingOurDNS && (console.log(), console.log(V({headings:["Name", "Type", "Address"], data:d.hosts, keys:["Name", "Type", "Address"]})));
}
;async function Rd() {
  const a = await (Y ? N.SANDBOX_COUPON() : N.COUPON());
  console.log(a);
}
;async function Sd(a, b) {
  let c = (await X("Getting current hosts", async() => {
    const {hosts:g, IsUsingOurDNS:h} = await a.dns.getHosts(b);
    if (!h) {
      throw Error(`Namecheap DNS is not being used for ${b}`);
    }
    return g;
  })).map(g => {
    const {TTL:h, Type:k, Address:l, Name:m, MXPref:n} = g;
    return {TTL:h, RecordType:k, Address:l, HostName:m, MXPref:n};
  });
  var d = Cc, e = xc;
  zc ? (e = "CNAME", d = zc) : yc && (e = "TXT", d = yc);
  const f = Object.entries({RecordType:e, Address:d, HostName:Bc, TTL:Ac, MXPref:Dc}).reduce((g, [h, k]) => {
    k && (g[h] = k);
    return g;
  }, {});
  d = aa(f, {colors:!0});
  if (Fc) {
    e = c.length;
    c = c.filter(g => Object.entries(f).some(([h, k]) => k != g[h]));
    if (c.length == e) {
      console.log("Host %s not found. Existing hosts:", d);
      console.log();
      Td(c);
      return;
    }
    if (!await I(`Are you sure you want to unset ${d}`)) {
      return;
    }
  } else {
    c.push(f);
  }
  if (!(await X(`Setting ${J(`${c.length}`, "yellow")} host records`, async() => await a.dns.setHosts(b, c))).IsSuccess) {
    throw Error("Operation wasn't successful.");
  }
  console.log("Successfully %s %s on %s. New hosts:", Fc ? "deleted" : "set", d, b);
  console.log();
  Td(c);
}
const Td = a => {
  console.log(V({headings:{HostName:"Name", RecordType:"Type"}, data:a, keys:["HostName", "RecordType", "Address"]}));
};
const Ud = require("../../package.json").version, Y = pc || !!process.env.SANDBOX, Z = q("expensive"), Vd = /expensive/.test(process.env.NODE_DEBUG);
if (rc) {
  console.log(Ud), process.exit();
} else {
  if (sc) {
    var Wd;
    {
      const a = O({usage:Q(ic), description:J("expensive", "yellow") + "\nA CLI application to access namecheap.com domain name registrar API."}), b = O({usage:{}, description:J("expensive domain.com --info", "magenta") + "\nDisplay the information about the domain on the account.\nAlso displays DNS hosts if using Namecheap's DNS."}).trim() + "\n", c = O({description:J("expensive", "red") + "\nPrint the list of domains belonging to the account.", usage:Q(Gc)}), d = O({description:J("expensive domain.com -r [-p PROMO]", 
      "green") + "\nRegister the domain name. Expensive will attempt to find the promo\ncode online, and compare its price to the normal price.", usage:Q(Mc)}), e = O({description:J("expensive domain|domain.com [domain.org] [-f] [-z app,page]", "blue") + `
Check domains for availability. When no TLD is given,
${Xc} are checked.`, usage:Q(tc)});
      Wd = [a, b, c, d, e].join("\n");
    }
    console.log(Wd);
    process.exit();
  }
}
const Yd = async(a, b = !1) => {
  try {
    if (qc) {
      return await Ld(a, b);
    }
    var c = a.ClientIp || await N.LOOKUP_IP();
    const d = new db({user:a.ApiUser, key:a.ApiKey, ip:c, sandbox:b});
    if (!S) {
      return await dd(d, {sort:Hc, desc:Ic, filter:Jc, type:Lc, pageSize:Kc});
    }
    [c] = S;
    if (xc || zc || yc) {
      return await Sd(d, c);
    }
    if (Ec) {
      return await yd(d, c);
    }
    if (kc) {
      return await Qd(d, c);
    }
    if (lc) {
      return await wd(d, {domain:c, promo:Oc, sandbox:b, years:Pc});
    }
    await id(d);
  } catch (d) {
    await Xd(d, a, b);
  }
}, Xd = async({stack:a, message:b, f:c}, d, e) => {
  c && (Z(aa(c, {colors:!0})), Z(Md[c.Number]));
  if (c && 1011150 == c.Number) {
    try {
      const [, f] = /Invalid request IP: (.+)/.exec(b) || [];
      await Ld(d, e, f);
    } catch ({message:f, stack:g}) {
      console.log("Could not white-list IP."), Vd ? Z(g) : console.error(f), process.exit(1);
    }
    return Yd(d, e);
  }
  Vd ? Z(a) : console.error(b);
  process.exit(1);
};
(async() => {
  try {
    if (oc) {
      return await Rd();
    }
    if (mc || nc) {
      return await Od();
    }
    if (jc) {
      return await Pd();
    }
  } catch (b) {
    const {stack:c, message:d} = b;
    Vd ? Z(c) : console.error(d);
    return;
  }
  const a = await Jd();
  await Yd(a, Y);
})();


//# sourceMappingURL=expensive.js.map