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
const p = util.debuglog, aa = util.inspect;
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
const v = os.homedir;
const ea = /\s+at.*(?:\(|\s)(.*)\)?/, fa = /^(?:(?:(?:node|(?:internal\/[\w/]*|.*node_modules\/(?:IGNORED_MODULES)\/.*)?\w+)\.js:\d+:\d+)|native)/, ha = v(), ia = a => {
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
;function w(a) {
  var {stack:b} = Error();
  const c = da(arguments);
  b = ca(b, a);
  return ja(c, b, a);
}
;const ka = https.request;
const la = http.request;
const ma = url.parse;
const na = stream.Writable;
const oa = (a, b) => {
  b.once("error", c => {
    a.emit("error", c);
  });
  return b;
};
class pa extends na {
  constructor(a) {
    const {binary:b = !1, rs:c = null, ...d} = a || {}, {g:e = w(!0), proxyError:f} = a || {}, g = (h, k) => e(k);
    super(d);
    this.b = [];
    this.w = new Promise((h, k) => {
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
          const n = ia(l.stack);
          l.stack = n;
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
  get h() {
    return this.w;
  }
}
const ta = async(a, b = {}) => {
  ({h:a} = new pa({rs:a, ...b, g:w(!0)}));
  return await a;
};
const ua = zlib.createGunzip;
const va = (a, b, c = {}) => {
  const {justHeaders:d, binary:e, g:f = w(!0)} = c;
  let g, h, k, l, n = 0, m = 0;
  c = (new Promise((r, u) => {
    g = a(b, async q => {
      ({headers:h} = q);
      k = {statusMessage:q.statusMessage, statusCode:q.statusCode};
      if (d) {
        q.destroy();
      } else {
        var t = "gzip" == q.headers["content-encoding"];
        q.on("data", x => n += x.byteLength);
        q = t ? q.pipe(ua()) : q;
        l = await ta(q, {binary:e});
        m = l.length;
      }
      r();
    }).on("error", q => {
      q = f(q);
      u(q);
    }).on("timeout", () => {
      g.abort();
    });
  })).then(() => ({body:l, headers:h, ...k, F:n, byteLength:m, u:null}));
  return {G:g, h:c};
};
const wa = (a = {}) => Object.keys(a).reduce((b, c) => {
  const d = a[c];
  c = `${encodeURIComponent(c)}=${encodeURIComponent(d)}`;
  return [...b, c];
}, []).join("&").replace(/%20/g, "+"), xa = async(a, b, {data:c, justHeaders:d, binary:e, g:f = w(!0)}) => {
  const {G:g, h} = va(a, b, {justHeaders:d, binary:e, g:f});
  g.end(c);
  a = await h;
  if ((a.headers["content-type"] || "").startsWith("application/json") && a.body) {
    try {
      a.u = JSON.parse(a.body);
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
const ya = p("aqt"), A = async(a, b = {}) => {
  const {data:c, type:d = "json", headers:e = {"User-Agent":`Mozilla/5.0 (Node.JS) ${z}`}, compress:f = !0, binary:g = !1, justHeaders:h = !1, method:k, timeout:l} = b;
  b = w(!0);
  const {hostname:n, protocol:m, port:r, path:u} = ma(a), q = "https:" === m ? ka : la, t = {hostname:n, port:r, path:u, headers:{...e}, timeout:l, method:k};
  if (c) {
    var x = d;
    var y = c;
    switch(x) {
      case "json":
        y = JSON.stringify(y);
        x = "application/json";
        break;
      case "form":
        y = wa(y), x = "application/x-www-form-urlencoded";
    }
    y = {data:y, contentType:x};
    ({data:x} = y);
    y = y.contentType;
    t.method = k || "POST";
    "Content-Type" in t.headers || (t.headers["Content-Type"] = y);
    "Content-Length" in t.headers || (t.headers["Content-Length"] = Buffer.byteLength(x));
  }
  !f || "Accept-Encoding" in t.headers || (t.headers["Accept-Encoding"] = "gzip, deflate");
  const {body:sb, headers:tb, byteLength:qa, statusCode:ub, statusMessage:vb, F:ra, u:sa} = await xa(q, t, {data:x, justHeaders:h, binary:g, g:b});
  ya("%s %s B%s", a, qa, `${qa != ra ? ` (raw ${ra} B)` : ""}`);
  return {body:sa ? sa : sb, headers:tb, statusCode:ub, statusMessage:vb};
};
const za = querystring.stringify;
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
;const Aa = new RegExp(`${/([^\s>=/]+)/.source}(?:\\s*=\\s*${/(?:"([\s\S]*?)"|'([\s\S]*?)')/.source})?`, "g"), Ba = new RegExp(`(?:\\s+((?:${Aa.source}\\s*)*))`);
const C = (a, b) => {
  a = (Array.isArray(a) ? a : [a]).join("|");
  return B(new RegExp(`<(${a})${Ba.source}?(?:${/\s*\/>/.source}|${/>([\s\S]+?)?<\/\1>/.source})`, "g"), b, "t a v v1 v2 c".split(" ")).map(({t:c, a:d = "", c:e = ""}) => {
    d = d.replace(/\/$/, "").trim();
    d = Ca(d);
    return {content:e, props:d, tag:c};
  });
}, Ca = a => B(Aa, a, ["key", "val", "def", "f"]).reduce((b, {key:c, val:d}) => {
  if (void 0 === d) {
    return b[c] = !0, b;
  }
  b[c] = "true" == d ? !0 : "false" == d ? !1 : /^\d+$/.test(d) ? parseInt(d, 10) : d;
  return b;
}, {});
const Da = a => Object.keys(a).reduce((b, c) => {
  const d = a[c];
  if (void 0 === d) {
    return b;
  }
  b[c] = d;
  return b;
}, {}), Ea = a => a.reduce((b, c) => b && "string" == typeof c, !0);
async function Fa({ApiUser:a, ApiKey:b, ClientIp:c, host:d}, e, f = {}, g = "GET") {
  if (!e) {
    throw Error("Command must be passed.");
  }
  f = Da(f);
  b = {ApiUser:a, ApiKey:b, UserName:a, ClientIp:c, Command:e};
  a = {"User-Agent":"Mozilla/5.0 (Node.JS; @rqt/namecheap v2.4.0) https://github.com/rqt/namecheap"};
  if ("GET" == g) {
    g = za({...b, ...f}), d = await A(`${d}/xml.response?${g}`, {headers:a});
  } else {
    if ("POST" == g) {
      g = za(b), d = await A(`${d}/xml.response?${g}`, {data:f, headers:a, type:"form"});
    } else {
      throw Error("Unknown method.");
    }
  }
  d = d.body;
  if (!d.startsWith('<?xml version="1.0" encoding="utf-8"?>')) {
    throw Error("non-xml response");
  }
  if (g = Ga(d)) {
    throw g;
  }
  [{content:d}] = C("CommandResponse", d);
  return d.trim();
}
const Ga = a => {
  [{content:a}] = C("Errors", a);
  if (a.length) {
    var b = C("Error", a);
    if (1 == b.length) {
      const [{content:c, props:d}] = b;
      a = c;
      b = d;
    } else {
      a = b.map(({content:c}) => c).join("; "), b = b.map(({props:c}) => c);
    }
    a = new Ha(a);
    a.props = b;
    return a;
  }
};
class Ha extends Error {
}
;const Ia = {name:"name", expire:"expiredate", create:"createdate"}, Ja = (a, b) => {
  if (!["name", "expire", "create"].includes(a.toLowerCase())) {
    throw Error(`Unknown sort by option: ${a}.`);
  }
  a = Ia[a].toUpperCase();
  return b ? `${a}_DESC` : a;
};
async function Ka(a, b = {}) {
  var c = b.sort, d = b.desc;
  const e = b.filter, f = b.type;
  b = {Page:b.page, PageSize:b.pageSize, SortBy:c ? Ja(c, d) : Ja("create", "desc"), SearchTerm:e, ListType:f};
  b = await a("namecheap.domains.getList", b);
  a = C("Domain", b).map(({props:g}) => g);
  [{content:d}] = C("Paging", b);
  [{content:b}] = C("TotalItems", d);
  [{content:c}] = C("CurrentPage", d);
  [{content:d}] = C("PageSize", d);
  return {domains:a, TotalItems:parseInt(b, 10), CurrentPage:parseInt(c, 10), PageSize:parseInt(d, 10)};
}
;const La = a => {
  let b, c, d;
  [{content:b}] = C("ID", a);
  try {
    [{props:d}] = C("EmailDetails", a);
  } catch (e) {
  }
  try {
    [{content:c}] = C("ExpiredDate", a);
  } catch (e) {
  }
  return {ID:parseInt(b, 10), ...c ? {ExpiredDate:c} : {}, ...d ? {EmailDetails:d} : {}};
}, Ma = a => {
  const [{content:b}] = C("UseAutoRenew", a), [{content:c}] = C("SubscriptionId", a), [{content:d}] = C("CreatedDate", a), [{content:e}] = C("ExpirationDate", a);
  [{content:a}] = C("IsActive", a);
  return {UseAutoRenew:"true" == b, SubscriptionId:parseInt(c, 10), CreatedDate:new Date(Date.parse(d)), ExpirationDate:new Date(Date.parse(e)), IsActive:1 == a};
}, Na = a => {
  const [{content:b, props:c}] = C("DomainGetInfoResult", a);
  var [{content:d}] = C("DomainDetails", b);
  [{content:a}] = C("CreatedDate", d);
  const [{content:e}] = C("ExpiredDate", d);
  [{content:d}] = C("NumYears", d);
  const [{content:f, props:g}] = C("Whoisguard", b), h = La(f);
  var [{content:k}] = C("PremiumDnsSubscription", b);
  k = Ma(k);
  const [{content:l, props:n}] = C("DnsDetails", b), m = C("Nameserver", l).map(({content:t}) => t), [{content:r, props:u}] = C("Modificationrights", b);
  let q = {};
  r && (q = C("Rights", r).reduce((t, {props:x}) => ({...t, [x.Type]:!0}), {}));
  return {...c, DomainDetails:{CreatedDate:a, ExpiredDate:e, NumYears:parseInt(d, 10)}, Whoisguard:{...g, ...h}, PremiumDnsSubscription:k, DnsDetails:{...n, Nameserver:m}, Modificationrights:{...u, ...q}};
};
async function Oa(a, b) {
  b = "string" == typeof b ? {domain:b} : b;
  a = await a("namecheap.domains.getinfo", {DomainName:b.domain, HostName:b.host});
  return Na(a);
}
;async function Pa(a, b) {
  const {domains:c = [], domain:d} = "string" == typeof b ? {domain:b} : b;
  if (!Array.isArray(c)) {
    throw Error("Domains must be a list.");
  }
  if (!Ea(c)) {
    throw Error("All domains must be strings.");
  }
  if (d && "string" != typeof d) {
    throw Error("Domain must be a string.");
  }
  b = [...c, ...d ? [d] : []];
  a = await a("namecheap.domains.check", {DomainList:b.join(",")});
  return C("DomainCheckResult", a).map(({props:e}) => e);
}
;async function Qa(a, b) {
  const {domain:c, years:d = 1, promo:e, address:f, registrantAddress:g = f, techAddress:h = f, adminAddress:k = f, billingAddress:l = f, nameservers:n = [], whois:m = !0, premium:r = {}} = b;
  b = D(g, "Registrant");
  const u = D(h, "Tech"), q = D(k, "Admin"), t = D(l, "AuxBilling");
  a = await a("namecheap.domains.create", {DomainName:c, Years:d, PromotionCode:e, ...b, ...u, ...q, ...t, Nameservers:n.join(","), AddFreeWhoisguard:m ? "yes" : "no", WGEnabled:m ? "yes" : "no", ...r}, "POST");
  [{props:a}] = C("DomainCreateResult", a);
  return a;
}
const Ra = "JobTitle FirstName LastName Address1 Address2 City StateProvince StateProvinceChoice Country Phone PhoneExt Fax EmailAddress".split(" "), D = (a, b) => Ra.reduce((c, d) => ({...c, [`${b}${d}`]:"StateProvince" != d || a[d] ? a[d] : "NA"}), {[`${b}OrganizationName`]:a.Organization, [`${b}PostalCode`]:a.Zip});
async function Sa(a, {H:b, I:c}) {
  a = await a("namecheap.domains.dns.getHosts", {SLD:b, TLD:c});
  const [{content:d, props:e}] = C("DomainDNSGetHostsResult", a);
  a = E(d, "Host");
  b = E(d, "host");
  c = E(d, "HOST");
  a = [...a, ...b, ...c];
  return {...e, hosts:a};
}
const E = (a, b) => C(b, a).map(({props:c}) => c);
async function Ta(a, b, c) {
  b = c.reduce((d, e, f) => {
    Object.entries(e).forEach(([g, h]) => {
      ["HostName", "RecordType", "Address", "MXPref", "TTL"].includes(g) && (d[`${g}${f + 1}`] = h);
    });
    return d;
  }, b);
  a = await a("namecheap.domains.dns.setHosts", b, "POST");
  [{props:a}] = C("DomainDNSSetHostsResult", a);
  return a;
}
;async function Ua(a) {
  a = await a("namecheap.users.address.getList");
  [{content:a}] = C("AddressGetListResult", a);
  return C("List", a).map(({props:b}) => b);
}
;const Va = p("expensive");
async function Wa(a, b) {
  a = await a("namecheap.users.address.getInfo", {AddressId:b});
  [{content:a}] = C("GetAddressInfoResult", a);
  return Xa(a);
}
const Ya = "AddressId UserName AddressName Default_YN FirstName LastName JobTitle Organization Address1 Address2 City StateProvince StateProvinceChoice Zip Country Phone PhoneExt EmailAddress".split(" "), Xa = a => Ya.reduce((b, c) => {
  try {
    let [{content:d}] = C(c, a);
    "Default_YN" == c ? d = "true" == d : "AddressId" == c && (d = parseInt(d, 10));
    return {...b, [c]:d};
  } catch (d) {
    return Va(`Could not extract tag ${c}`), b;
  }
}, {});
const $a = async(a, b) => {
  a = await a("namecheap.users.getPricing", {ProductType:b.type, ProductCategory:b.category, PromotionCode:b.promoCode, ActionName:b.action, ProductName:b.product});
  return C("ProductType", a).reduce((c, {content:d, props:{Name:e}}) => {
    d = Za(d);
    c[e] = d;
    return c;
  }, {});
}, Za = a => C("ProductCategory", a).reduce((b, {content:c, props:{Name:d}}) => {
  c = ab(c);
  b[d] = c;
  return b;
}, {}), ab = a => C("Product", a).reduce((b, {content:c, props:{Name:d}}) => {
  c = C("Price", c).map(({props:e}) => e);
  d = d.replace(/-(.)/g, (e, f) => f.toUpperCase());
  b[d] = c;
  return b;
}, {});
class bb {
  constructor(a) {
    const {user:b, key:c, sandbox:d = !1, ip:e} = a;
    this.o = b;
    this.l = c;
    this.b = `https://api.${d ? "sandbox." : ""}namecheap.com`;
    this.f = e;
    const f = this.m.bind(this);
    this.users = {async getPricing(g) {
      return await $a(f, g);
    }};
    this.domains = {async getList(g = {}) {
      return await Ka(f, g);
    }, async getInfo(g) {
      return await Oa(f, g);
    }, async check(g) {
      return await Pa(f, g);
    }, async create(g) {
      return await Qa(f, g);
    }};
    this.address = {async getList() {
      return await Ua(f);
    }, async getInfo(g) {
      return await Wa(f, g);
    }};
    this.dns = {async getHosts(g) {
      const [h, ...k] = g.split(".");
      g = k.join(".");
      return await Sa(f, {H:h, I:g});
    }, async setHosts(g, h, k = {}) {
      const [l, ...n] = g.split(".");
      g = n.join(".");
      return await Ta(f, {SLD:l, TLD:g, ...k}, h);
    }};
  }
  async m(a, b, c) {
    const d = w(!0);
    try {
      return await Fa({ApiKey:this.l, ApiUser:this.o, host:this.b, ClientIp:this.f}, a, b, c);
    } catch (e) {
      if (e instanceof Ha) {
        throw d(e);
      }
      throw e;
    }
  }
}
;const cb = fs.createReadStream, db = fs.createWriteStream, eb = fs.existsSync, fb = fs.stat;
async function gb(a) {
  a = cb(a);
  return await ta(a);
}
;async function hb(a, b) {
  if (!a) {
    throw Error("No path is given.");
  }
  const c = w(!0), d = db(a);
  await new Promise((e, f) => {
    d.on("error", g => {
      g = c(g);
      f(g);
    }).on("close", e).end(b);
  });
}
;const ib = p("bosom"), jb = async(a, b, c) => {
  const {replacer:d = null, space:e = null} = c;
  b = JSON.stringify(b, d, e);
  await hb(a, b);
}, F = async(a, b, c = {}) => {
  if (b) {
    return await jb(a, b, c);
  }
  ib("Reading %s", a);
  a = await gb(a);
  return JSON.parse(a);
};
const kb = async(a, b = {}) => {
  ({body:a} = await A(a, b));
  return a;
};
async function G(a, b, c = {}) {
  {
    const {headers:d = {}, ...e} = c;
    c = {...e, headers:{...a.headers, ...d, Cookie:a.Cookie}};
  }
  b = await A(a.host ? `${a.host}${b}` : b, c);
  a.cookies = lb(a.cookies, b.headers);
  return b;
}
class H {
  constructor(a = {}) {
    const {host:b, headers:c = {}} = a;
    this.host = b;
    this.headers = c;
    this.cookies = {};
  }
  async rqt(a, b = {}) {
    ({body:a} = await G(this, a, b));
    return a;
  }
  async bqt(a, b = {}) {
    ({body:a} = await G(this, a, {...b, binary:!0}));
    return a;
  }
  async jqt(a, b = {}) {
    ({body:a} = await G(this, a, b));
    return a;
  }
  async aqt(a, b = {}) {
    return await G(this, a, b);
  }
  get Cookie() {
    return mb(this.cookies);
  }
}
const mb = a => Object.keys(a).reduce((b, c) => {
  c = `${c}=${a[c]}`;
  return [...b, c];
}, []).join("; "), lb = (a, b) => {
  b = nb(b);
  const c = {...a, ...b};
  return Object.keys(c).reduce((d, e) => {
    const f = c[e];
    return f ? {...d, [e]:f} : d;
  }, {});
}, nb = ({"set-cookie":a = []} = {}) => a.reduce((b, c) => {
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
async function ob() {
  const {host:a = "https://api.ipify.org"} = {};
  return await kb(a);
}
;const I = assert.ok;
const pb = readline.createInterface;
function qb(a, b, c) {
  return setTimeout(() => {
    const d = Error(`${a ? a : "Promise"} has timed out after ${b}ms`);
    d.stack = `Error: ${d.message}`;
    c(d);
  }, b);
}
function rb(a, b) {
  let c;
  const d = new Promise((e, f) => {
    c = qb(a, b, f);
  });
  return {timeout:c, h:d};
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
  const {h:d, timeout:e} = rb(c, b);
  try {
    return await Promise.race([a, d]);
  } finally {
    clearTimeout(e);
  }
}
;function xb(a, b = {}) {
  const {timeout:c, password:d = !1, output:e = process.stdout, input:f = process.stdin, ...g} = b;
  b = pb({input:f, output:e, ...g});
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
async function J(a, b) {
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
;async function zb(a, b) {
  return await J(a, b);
}
async function K(a) {
  ({question:a} = await J({question:a}, void 0));
  return a;
}
async function L(a, b = {}) {
  const {defaultYes:c = !0, timeout:d} = b;
  b = a.endsWith("?");
  ({question:a} = await J({question:{text:`${b ? a.replace(/\?$/, "") : a} (y/n)${b ? "?" : ""}`, defaultValue:c ? "y" : "n"}}, d));
  return "y" == a;
}
;/*
 diff package https://github.com/kpdecker/jsdiff
 BSD License
 Copyright (c) 2009-2015, Kevin Decker <kpdecker@gmail.com>
*/
const Ab = {black:30, red:31, green:32, yellow:33, blue:34, magenta:35, cyan:36, white:37, grey:90}, Bb = {black:40, red:41, green:42, yellow:43, blue:44, magenta:45, cyan:46, white:47};
function M(a, b) {
  return (b = Ab[b]) ? `\x1b[${b}m${a}\x1b[0m` : a;
}
function Cb(a) {
  const b = Bb.green;
  return b ? `\x1b[${b}m${a}\x1b[0m` : a;
}
;const Db = a => B(/<input type="hidden" name="(.+?)" id="__\w+" value="(.*?)" \/>/g, a, ["name", "value"]).reduce((b, {name:c, value:d}) => ({...b, [c]:d}), {}), Eb = a => {
  const b = /(.+?)(\d\d\d)$/.exec(a);
  if (!b) {
    return a;
  }
  const [, c, d] = b;
  return `${M(c, "grey")}${d}`;
}, Fb = a => a.map(({title:b}) => ` ${b}`).map(Eb).join("\n"), Gb = async(a, b) => {
  var c = `Which phone number to use for 2 factor auth
${Fb(a)}
enter last 3 digits`;
  const d = await K({text:c, async getDefault() {
    return b || a[0].last;
  }, validation(e) {
    if (!a.some(({last:f}) => f == e)) {
      throw Error("Unknown number entered.");
    }
  }});
  ({value:c} = a.find(({last:e}) => e == d));
  return c;
}, Hb = (a, b) => {
  var c = Object.keys(a).reduce((d, e) => {
    var f = a[e];
    const g = b[e];
    return e in b ? f !== g ? (f = M(`${`-  ${e}`}: ${f}`, "red"), e = M(`${`+  ${e}`}: ${g}`, "green"), [...d, f, e]) : d : (e = M(`${`-  ${e}`}: ${f}`, "red"), [...d, e]);
  }, []);
  c = Object.keys(b).reduce((d, e) => {
    const f = a[e];
    return e in a ? d : (e = M(`${`+  ${e}`}: ${f}`, "green"), [...d, e]);
  }, c);
  if (c.length) {
    throw c = `
{
${c.join("\n")}
}`.trim(), Error(c);
  }
};
const Ib = p("@rqt/namecheap-web");
async function Jb(a) {
  const {SessionKey:b} = await a.session.jqt("/cart/ajax/SessionHandler.ashx");
  if (!b) {
    throw Error(`Could not acquire the session key from ${a.session.host}${"/cart/ajax/SessionHandler.ashx"}.`);
  }
  Ib("Obtained a session key %s", b);
  a.b = b;
}
async function Kb(a, b = !1) {
  var c = await a.session.rqt(N.b);
  I(/Select Phone Contact Number/.test(c), 'Could not find the "Select Phone" section.');
  var d = B(/<option value="(\d+-phone)">(.+?(\d\d\d))<\/option>/g, c, ["value", "title", "last"]);
  I(d.length, "Could not find any numbers.");
  d = await Gb(d, a.m);
  c = {...Db(c), ctl00$ctl00$ctl00$ctl00$base_content$web_base_content$home_content$page_content_left$CntrlAuthorization$ddlAuthorizeList:d, ctl00$ctl00$ctl00$ctl00$base_content$web_base_content$home_content$page_content_left$CntrlAuthorization$btnSendVerification:"Proceed with Login"};
  c = await a.session.rqt(N.b, {data:c, type:"form"});
  if (/You have reached the limit on the number.+/m.test(c)) {
    throw Error(c.match(/You have reached the limit on the number.+/m)[0]);
  }
  d = /Error occured during Two-Factor authentication provider call./m.test(c);
  if (!b && d) {
    return console.log("Received an error message: Error occured during Two-Factor authentication provider call."), console.log("Retrying to get the code, if you get 2 messages, dismiss the first one."), await Kb(a, !0);
  }
  if (b && d) {
    throw Error("Error occured during Two-Factor authentication provider call.");
  }
  I(/We sent a message with the verification code/.test(c), "Could not find the code entry section.");
  await Lb(a, c);
}
async function Mb(a) {
  const {body:b, statusCode:c, headers:{location:d}} = await a.session.aqt(N.f, {data:{hidden_LoginPassword:"", LoginUserName:a.o, LoginPassword:a.l, sessionEncryptValue:a.b}, type:"form"});
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
  if (302 == c && d.includes(N.b)) {
    await Kb(a);
  } else {
    throw Error(`Unknown result (status code ${c})`);
  }
  return a.session.cookies;
}
async function Lb(a, b) {
  var [, c] = /Your 6-digit code begins with (\d)./.exec(b) || [];
  if (!c) {
    throw Error("Could not send the code.");
  }
  c = await K({text:`Security code (begins with ${c})`});
  b = {...Db(b), ctl00$ctl00$ctl00$ctl00$base_content$web_base_content$home_content$page_content_left$CntrlAuthorization$txtAuthVerification:c, ctl00$ctl00$ctl00$ctl00$base_content$web_base_content$home_content$page_content_left$CntrlAuthorization$btnVerify:"Submit Security Code"};
  const {body:d, headers:{location:e}} = await a.session.aqt(N.b, {data:b, type:"form"});
  if (/Oops, you entered an invalid code.+/m.test(d)) {
    return console.log("Incorrect code, try again."), await Lb(a, d);
  }
  I(/Object moved/.test(d), "Expected to have been redirected after sign-in.");
  return e;
}
class N {
  constructor({username:a, password:b, phone:c, host:d, userAgent:e} = {}) {
    d = new H({host:d, headers:{"User-Agent":e}});
    this.o = a;
    this.l = b;
    this.f = d;
    this.m = c;
    this.b = null;
  }
  static get f() {
    return "/myaccount/login-signup/";
  }
  static get b() {
    return "/myaccount/twofa/secondauth.aspx";
  }
  get session() {
    return this.f;
  }
}
;const Nb = a => {
  if (a.__isError) {
    var b = Error(a.Message);
    Object.assign(b, a);
    throw b;
  }
  if (!a.Success) {
    throw b = a.Errors.map(({Message:c}) => c).join(", "), b = Error(b), b.__type = a.__type, b;
  }
};
function O(a) {
  return `/api/v1/ncpl/apiaccess/ui/${a}`;
}
async function Ob(a) {
  ({statusCode:a} = await a.session.aqt("/", {justHeaders:!0}));
  return 200 == a;
}
async function Pb(a) {
  a = await a.session.rqt(Qb.b);
  a = /<input type="hidden" id="x-ncpl-csrfvalue" value="(.+?)"/.exec(a);
  if (!a) {
    throw Error("Could not find the x-ncpl-csrfvalue token on the page.");
  }
  [, a] = a;
  return a;
}
async function Rb(a, b, c = `@rqt ${(new Date).toLocaleString()}`.replace(/:/g, "-")) {
  const d = await Pb(a);
  await a.request(O("AddIpAddress"), d, {accountPassword:a.password, ipAddress:b, name:c});
}
async function Sb(a, b) {
  const c = await Pb(a);
  await a.request(O("RemoveIpAddresses"), c, {accountPassword:a.password, names:[b]});
}
async function Tb(a) {
  const b = await Pb(a);
  ({IpAddresses:a} = await a.request(O("GetWhitelistedIpAddresses"), b));
  return a.map(({Name:c, IpAddress:d, ModifyDate:e}) => ({Name:c, IpAddress:d, ModifyDate:new Date(`${e}Z`)}));
}
class Qb {
  constructor({cookies:a, host:b, userAgent:c, password:d}) {
    b = new H({host:b, headers:{"User-Agent":c}});
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
    Nb(a);
    return a.Data;
  }
}
;const Ub = async a => {
  if (!a) {
    throw Error("Please specify the domain.");
  }
  return await (new H({host:"https://www.namecheap.com", headers:{"User-Agent":"Mozilla/5.0 (Node.js; @rqt/namecheap-web) https://github.com/rqt/namecheap-web"}})).rqt(`/domains/whoislookup-api/${a}`);
};
const Vb = async(a = !1) => {
  a = await kb(`https://www.${a ? "sandbox." : ""}namecheap.com/promos/coupons/`, {headers:{"User-Agent":"Mozilla/5.0 (Node.js; @rqt/namecheap-web) https://github.com/rqt/namecheap-web"}});
  a = /"couponCode":"(.+?)"/.exec(a);
  if (!a) {
    throw Error("Could not find the coupon code.");
  }
  return a[1];
};
const Wb = p("@rqt/namecheap-web"), Xb = (a = !1) => `https://www.${a ? "sandbox." : ""}namecheap.com`, Yb = (a = !1) => `https://ap.www.${a ? "sandbox." : ""}namecheap.com`;
async function Zb(a, b) {
  a.f.readSession && await $b(b, a.f.sessionFile);
}
async function P(a, b) {
  const c = ac(a.b.session.cookies);
  b = await b;
  const d = ac(a.b.session.cookies);
  try {
    Hb(c, d);
  } catch ({message:e}) {
    Wb(e), await Zb(a, d);
  }
  return b;
}
class Q {
  constructor(a = {}) {
    const {sandbox:b, readSession:c, sessionFile:d = ".namecheap-web.json"} = a;
    this.f = {sandbox:b, readSession:c, sessionFile:d};
    this.b = null;
  }
  static async["LOOKUP_IP"]() {
    return await ob();
  }
  static async["WHOIS"](a) {
    return Ub(a);
  }
  static async["COUPON"]() {
    return Vb();
  }
  static async["SANDBOX_COUPON"]() {
    return Vb(!0);
  }
  async auth(a, b, c, d = !1) {
    var e;
    this.f.readSession && !d && (e = await bc(this.f.sessionFile));
    e || (e = new N({username:a, password:b, host:Xb(this.f.sandbox), phone:c, userAgent:"Mozilla/5.0 (Node.js; @rqt/namecheap-web) https://github.com/rqt/namecheap-web"}), await Jb(e), e = await Mb(e), await Zb(this, e));
    this.b = new Qb({cookies:e, password:b, host:Yb(this.f.sandbox), userAgent:"Mozilla/5.0 (Node.js; @rqt/namecheap-web) https://github.com/rqt/namecheap-web"});
    e = await P(this, Ob(this.b));
    if (!e && d) {
      throw Error("Could not authenticate.");
    }
    e || await this.auth(a, b, c, !0);
  }
  async whitelistIP(a, b) {
    await P(this, Rb(this.b, a, b));
  }
  async getWhitelistedIPList() {
    return await P(this, Tb(this.b));
  }
  async removeWhitelistedIP(a) {
    await P(this, Sb(this.b, a));
  }
}
const ac = a => {
  const b = ["x-ncpl-auth", ".ncauth", "SessionId", "U"];
  return Object.keys(a).reduce((c, d) => b.includes(d) ? {...c, [d]:a[d]} : c, {});
}, bc = async a => {
  try {
    return await F(a);
  } catch (b) {
    return null;
  }
}, $b = async(a, b) => {
  await F(b, a);
};
function R(a = {usage:{}}) {
  const {usage:b = {}, description:c, line:d, example:e} = a;
  a = Object.keys(b);
  const f = Object.values(b), [g] = a.reduce(([l = 0, n = 0], m) => {
    const r = b[m].split("\n").reduce((u, q) => q.length > u ? q.length : u, 0);
    r > n && (n = r);
    m.length > l && (l = m.length);
    return [l, n];
  }, []), h = (l, n) => {
    n = " ".repeat(n - l.length);
    return `${l}${n}`;
  };
  a = a.reduce((l, n, m) => {
    m = f[m].split("\n");
    n = h(n, g);
    const [r, ...u] = m;
    n = `${n}\t${r}`;
    const q = h("", g);
    m = u.map(t => `${q}\t${t}`);
    return [...l, n, ...m];
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
;const cc = (a, b, c, d = !1, e = !1) => {
  const f = c ? new RegExp(`^-(${c}|-${b})$`) : new RegExp(`^--${b}$`);
  b = a.findIndex(g => f.test(g));
  if (-1 == b) {
    return {argv:a};
  }
  if (d) {
    return {value:!0, index:b, length:1};
  }
  d = a[b + 1];
  if (!d || "string" == typeof d && d.startsWith("--")) {
    return {argv:a};
  }
  e && (d = parseInt(d, 10));
  return {value:d, index:b, length:2};
}, dc = a => {
  const b = [];
  for (let c = 0; c < a.length; c++) {
    const d = a[c];
    if (d.startsWith("-")) {
      break;
    }
    b.push(d);
  }
  return b;
}, S = a => Object.keys(a).reduce((b, c) => {
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
const ec = {domains:{description:"The domain name for operations, or multiple domain names\nfor checking availability.", command:!0, multiple:!0}, init:{description:"Initialise package configuration interactively, i.e.,\nthe API key and ip address.", boolean:!0, short:"I"}, info:{description:"Show the information for the domain.", boolean:!0, short:"i"}, register:{description:"Register the domain.", boolean:!0, short:"r"}, whois:{description:"Display brief WHOIS data.", boolean:!0, short:"w"}, Whois:{description:"Display full WHOIS data.", 
boolean:!0}, coupon:{description:"Find this month's coupon.", boolean:!0}, sandbox:{description:"Use the sandbox API.", boolean:!0, short:"s"}, whitelistIP:{description:"Add current IP address to the list of white-listed ones.", boolean:!0, short:"W"}, version:{description:"Display the current version number.", boolean:!0, short:"v"}, help:{description:"Show help information.", boolean:!0, short:"h"}}, fc = {free:{description:"Display only free domains.", boolean:!0, short:"f"}, zones:{description:"Check in these zones only.", 
short:"z"}}, gc = {record:{description:"The record type. Can be one of the following:\n`A`, `AAAA`, `ALIAS`, `CAA`, `CNAME`, `MX`, `MXE`,\n`NS`, `TXT`, `URL`, `URL301`, `FRAME`."}, TXT:{description:"Add a TXT record with this address to the domain.\nAlias for `--record TXT --address <TXT>`.", short:"TXT"}, A:{description:"Add an `A` record with this address to the domain.\nAlias for `--record A --address <A>`.", short:"A"}, CNAME:{description:"Add a CNAME record with this address to the domain.\n`--record CNAME --address <CNAME>`.", 
short:"CNAME"}, ttl:{description:"When adding host records, sets the _TTL_.\nBy default, namecheap sets 1800."}, host:{description:"The host name for adding dns records.", default:"@"}, address:{description:"The address of the new host record."}, mxpref:{description:"MX preference for hosts. Applicable to MX records only."}, github:{description:"Setup GitHub pages for the apex domain as per docs\nhttps://git.io/fjyr7 Also removes the parking page\nand URL redirect. All other hosts are kept itact.", 
boolean:!0, short:"g"}, "delete":{description:"Remove the specified host record.", boolean:!0, short:"d"}}, hc = {sort:{description:"Sort by this field (name, expire, create).", short:"S"}, desc:{description:"Sort in descending order.", boolean:!0, short:"D"}, filter:{description:"Filter by this word.", short:"F"}, pageSize:{description:"The page size.", short:"P"}, type:{description:"Domain type (ALL, EXPIRING, EXPIRED).", short:"T"}}, ic = {promo:{description:"Use this promo code on registration.", 
short:"p"}, years:{description:"The number of years that the domain should be registered for.", short:"y"}}, T = function(a = {}, b = process.argv) {
  let [, , ...c] = b;
  const d = dc(c);
  c = c.slice(d.length);
  a = Object.entries(a).reduce((g, [h, k]) => {
    g[h] = "string" == typeof k ? {short:k} : k;
    return g;
  }, {});
  const e = [];
  a = Object.entries(a).reduce((g, [h, k]) => {
    let l;
    try {
      const n = k.short, m = k.boolean, r = k.number, u = k.command, q = k.multiple;
      if (u && q && d.length) {
        l = d;
      } else {
        if (u && d.length) {
          l = d[0];
        } else {
          const t = cc(c, h, n, m, r);
          ({value:l} = t);
          const x = t.index, y = t.length;
          void 0 !== x && y && e.push({index:x, length:y});
        }
      }
    } catch (n) {
      return g;
    }
    return void 0 === l ? g : {...g, [h]:l};
  }, {});
  let f = c;
  e.forEach(({index:g, length:h}) => {
    Array.from({length:h}).forEach((k, l) => {
      f[g + l] = null;
    });
  });
  f = f.filter(g => null !== g);
  Object.assign(a, {S:f});
  return a;
}({...ec, ...fc, ...gc, ...hc, ...ic}), U = T.domains, jc = T.init, kc = T.info, lc = T.register, mc = T.whois, nc = T.Whois, oc = T.coupon, pc = T.sandbox, qc = T.whitelistIP, rc = T.version, sc = T.help, tc = T.free, uc = T.zones, vc = T.record, wc = T.TXT, xc = T.A, yc = T.CNAME, zc = T.ttl, Ac = T.host || "@", Bc = T.address, Cc = T.mxpref, Dc = T.github, Ec = T["delete"], Fc = T.sort, Gc = T.desc, Hc = T.filter, Ic = T.pageSize, Jc = T.type, Kc = T.promo, Lc = T.years;
const Mc = "com net org biz co cc io bz nu app page".split(" "), Nc = (a, b) => (b.length ? Mc.filter(c => b.includes(c)) : Mc).map(c => `${a}.${c}`), Oc = M("\u2713", "green"), Pc = M("-", "grey"), Qc = a => a.map(b => {
  var c = b.Expires;
  const d = b.IsOurDNS, e = Date.parse(b.Created);
  c = Date.parse(c);
  const f = (new Date).getTime();
  return {...b, Since:Math.round(Math.abs((f - e) / 864E5)), Expiry:Math.round(Math.abs((c - f) / 864E5)), Years:Math.abs((new Date(f - (new Date(e)).getTime())).getUTCFullYear() - 1970), DNS:d};
}), Rc = a => "ENABLED" == a ? {value:Oc, length:1} : "NOTPRESENT" == a ? {value:Pc, length:1} : {value:a, length:a.length}, Sc = a => a ? "expensive-sandbox" : "expensive";
const Tc = Mc.join(", "), Uc = () => {
  var a = S(gc);
  return Object.entries(a).reduce((b, [c, d]) => {
    d = d.replace(/`(.+?)`/g, (e, f) => `\x1b[1m${f}\x1b[0m`);
    b[c] = d;
    return b;
  }, {});
};
const Vc = a => ({value:`\x1b[1m${a}\x1b[0m`, length:a.length}), Wc = a => a.reduce((b, c) => ({...b, [c]:!0}), {});
function V(a) {
  const {keys:b = [], data:c = [], headings:d = {}, replacements:e = {}, centerValues:f = [], centerHeadings:g = []} = a;
  var [h] = c;
  if (!h) {
    return "";
  }
  const k = Wc(f);
  a = Wc(g);
  h = Object.keys(h).reduce((m, r) => {
    const u = d[r];
    return {...m, [r]:u ? u.length : r.length};
  }, {});
  const l = c.reduce((m, r) => Object.keys(r).reduce((u, q) => {
    const t = m[q], {length:x} = Xc(e, q)(r[q]);
    return {...u, [q]:Math.max(x, t)};
  }, {}), h);
  h = b.reduce((m, r) => ({...m, [r]:d[r] || r}), {});
  const n = b.reduce((m, r) => ({...m, [r]:Vc}), {});
  a = Yc(b, h, l, n, a);
  h = c.map(m => Yc(b, m, l, e, k));
  return [a, ...h].join("\n");
}
const Zc = (a, b, c, d) => {
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
}, Xc = (a, b) => (a = a[b]) ? a : c => ({value:c, length:`${c}`.replace(/\033\[.*?m/g, "").length}), Yc = (a, b, c, d = {}, e = {}) => {
  let f = 0;
  return a.map(g => {
    const h = c[g];
    if (!h) {
      throw Error(`Unknown field ${g}`);
    }
    var k = b[g];
    const l = Xc(d, g), n = e[g], [m, ...r] = `${k}`.split("\n");
    g = Zc(m, h, l, n);
    k = "";
    r.length && (k = "\n" + r.map(u => {
      const q = " ".repeat(f);
      u = Zc(u, h, l, n);
      return `${q}${u}`;
    }).join("\n"));
    f += h + 2;
    return `${g}${k}`;
  }).join("  ");
};
function $c(a = []) {
  a.length ? (a = Qc(a), a = V({keys:["Name", "Expiry", "Years", "WhoisGuard", "DNS"], data:a, headings:{WhoisGuard:"Whois"}, replacements:{WhoisGuard:Rc, ["DNS"](b) {
    return b ? {value:"yes", length:3} : {value:"", length:0};
  }, ["Years"](b) {
    return b ? {value:b, length:`${b}`.length} : {value:"", length:0};
  }}, centerValues:["WhoisGuard"]}), console.log(a)) : console.log("No domains");
}
;async function ad(a, {sort:b, desc:c, page:d, filter:e, type:f, pageSize:g} = {}) {
  const {domains:h, ...k} = await a.domains.getList({page:d, sort:b, desc:c, filter:e, type:f, pageSize:g});
  $c(h);
  (d = bd(k)) && await L(`Page ${cd(k)}. Display more`) && await ad(a, {page:d, sort:b, desc:c, filter:e, type:f, pageSize:g});
}
const bd = ({CurrentPage:a, TotalItems:b, PageSize:c}) => {
  if (a * c < b) {
    return a + 1;
  }
}, cd = ({CurrentPage:a, TotalItems:b, PageSize:c}) => `${a}/${Math.ceil(b / c)}`;
const dd = path.join, ed = path.resolve;
const W = ed(v(), ".expensive.log");
async function fd(a) {
  var {domains:b, B:c, K:d = ""} = {domains:U, K:uc, B:tc}, e = b.reduce((h, k) => /\./.test(k) ? [...h, k] : (k = Nc(k, d ? d.split(",") : []), [...h, ...k]), []);
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
  e = V({keys:["Domain", "Available", ...e ? ["IsPremiumName"] : [], ...g ? ["PremiumRegistrationPrice"] : []], data:a.map(h => ({...h, Available:h.Available ? M("yes", "green") : M("no", "red"), IsPremiumName:h.IsPremiumName ? M("\u2713", "green") : "", PremiumRegistrationPrice:h.PremiumRegistrationPrice ? parseFloat(h.PremiumRegistrationPrice).toFixed(2) : ""})), headings:{IsPremiumName:"Premium", PremiumRegistrationPrice:"Price"}, centerValues:["Available", "IsPremiumName"]});
  console.log(e);
  await gd(b.join(","), a);
}
const gd = async(a, b) => {
  eb(W) || await F(W, []);
  a = [...await F(W), {[a]:b.filter(({Available:c}) => c).map(({Domain:c}) => c)}];
  await F(W, a, {space:2});
};
const hd = (a, b) => {
  a = " ".repeat(Math.max(a - b.length, 0));
  return `${b}${a}`;
}, id = a => {
  a = a.split("\n");
  const b = {}.width || a.reduce((c, {length:d}) => d > c ? d : c, 0);
  return a.map(hd.bind(null, b)).join("\n");
};
function jd(a) {
  const {padding:b = 1} = {};
  var c = a.split("\n").reduce((f, {length:g}) => g > f ? g : f, 0) + 2 * b;
  const d = `\u250c${"\u2500".repeat(c)}\u2510`;
  c = `\u2514${"\u2500".repeat(c)}\u2518`;
  const e = " ".repeat(b);
  a = id(a).split("\n").map(f => `\u2502${e}${f}${e}\u2502`).join("\n");
  return `${d}\n${a}\n${c}`;
}
;async function X(a, b) {
  const {interval:c = 250, writable:d = process.stdout} = {};
  b = "function" == typeof b ? b() : b;
  const e = d.write.bind(d);
  var f = process.env.b;
  if (f && "0" != f) {
    return e(`${a}<INDICATRIX_PLACEHOLDER>`), await b;
  }
  let g = 1, h = `${a}${".".repeat(g)}`;
  e(h);
  f = setInterval(() => {
    g = (g + 1) % 4;
    h = `${a}${".".repeat(g)}`;
    e(`\r${" ".repeat(a.length + 3)}\r`);
    e(h);
  }, c);
  try {
    return await b;
  } finally {
    clearInterval(f), e(`\r${" ".repeat(a.length + 3)}\r`);
  }
}
;p("expensive");
const kd = a => (a = a.find(({IsDefault:b}) => b)) ? a.AddressId : null, ld = async a => await (a ? Q.SANDBOX_COUPON() : Q.COUPON()), md = a => {
  a = a.split(".");
  return a[a.length - 1];
}, nd = (a, b, c) => a.domains.register[b].find(({Duration:d}) => d == c), od = async(a, b, c, d) => {
  const e = await a.users.getPricing({type:"DOMAIN", promoCode:d, action:"REGISTER", product:b});
  if (d) {
    var f = await a.users.getPricing({type:"DOMAIN", action:"REGISTER", product:b});
    ({YourPrice:f} = nd(f, b, c));
  }
  b = nd(e, b, c);
  return {j:d, AdditionalCost:b.YourAdditonalCost, Price:b.YourPrice, R:b.YourPriceType, M:b.YourAdditonalCostType, Currency:b.Currency, s:f};
}, pd = async(a, b, c) => {
  if (a) {
    return console.log("Using promo %s", a), a;
  }
  if (["com", "net", "org", "info", "biz"].includes(c)) {
    try {
      const d = await X("Checking coupon online", ld(b));
      if (await L(`\rApply coupon ${d}?`)) {
        return d;
      }
    } catch (d) {
      console.log("Could not retrieve promo");
    }
  }
}, qd = async({IsPremiumName:a, PremiumRegistrationPrice:b, EapFee:c}) => {
  let d = !0;
  a && (d = await L(`Continue with the premium registration price of ${b}?`, {defaultYes:!1}));
  parseFloat(c) && (d = d && await L(`Continue with the early access fee of ${c}?`, {defaultYes:!1}));
  if (!d) {
    throw Error("No confirmation.");
  }
}, rd = a => a.map(b => ({...b, value:`SKIP-${b.value}`})), sd = async(a, {D:b, years:c, promo:d, J:e}) => {
  var f = a.IcannFee, g = a.PremiumRenewalPrice, h = a.PremiumTransferPrice;
  const k = a.PremiumRegistrationPrice;
  var l = a.IsPremiumName;
  a = a.EapFee;
  b = await od(b, e, c, d);
  g = [{name:"Premium Registration Price", value:k, i:k}, ...rd([{name:"Premium Renewal Price", value:g}, {name:"Premium Transfer Price", value:h}])];
  h = 0 != parseFloat(a);
  a = [{name:"Eap Fee", value:a, i:a}];
  l = [...l ? g : [], ...h ? a : []];
  a = [{name:"Price", value:b.Price, i:b.Price}, ...rd(b.j ? [{name:"Without Promo", value:b.s}] : []), ...f ? [{name:"Icann Fee", value:f}] : [], ...b.AdditionalCost ? [{name:"Additional Cost", value:`${b.AdditionalCost}`, i:b.AdditionalCost}] : []];
  f = (g = l.length) ? [...l, ...rd(a)] : a;
  l = (g ? l : a).reduce((n, {i:m = 0}) => n + parseFloat(m), 0);
  l = `${Number(l).toFixed(2)} ${b.Currency}`;
  l = [{name:"-----", value:"-".repeat(l.length)}, {name:"Total", value:l}];
  f = V({keys:["name", "value"], data:[...f, ...l], headings:["Price", "Value"], replacements:{value(n) {
    const [, m] = `${n}`.split("SKIP-");
    return m ? {value:M(m, "grey"), length:m.length} : {value:n, length:n.length};
  }}}).replace(/.+\n/, "");
  return {v:b, table:f};
};
async function td(a, {domain:b, promo:c, sandbox:d, years:e = 1}) {
  const f = await X(`Confirming availability of ${b}`, async() => {
    const [t] = await a.domains.check(b);
    return t;
  }), g = f.EapFee, h = f.PremiumRegistrationPrice;
  var k = f.Domain;
  const l = f.IsPremiumName;
  if (!f.Available) {
    throw Error(`Domain ${k} is not available.`);
  }
  k = md(b);
  const n = await pd(c, d, k), {v:m, table:r} = await X(`Getting ${e}-year price`, sd(f, {D:a, promo:n, years:e, J:k}));
  console.log("\n%s", r);
  m.j && parseFloat(m.Price) > parseFloat(m.s) && console.log("[!] Warning: you will pay more with coupon %s than without it.", m.j);
  console.log("");
  l && await qd({IsPremiumName:l, PremiumRegistrationPrice:h, EapFee:g});
  const u = await X("Finding default address", async() => {
    var t = await a.address.getList();
    t = kd(t);
    if (!t) {
      throw Error("Could not find the default address.");
    }
    return await a.address.getInfo(t);
  });
  console.log("\rRegistering %s using:", Cb(b));
  ud(u);
  if (await L("OK?", {defaultYes:!1})) {
    var q;
    try {
      ({ChargedAmount:q} = await X("Registering the domain", async() => a.domains.create({address:u, domain:b, years:e, promo:n, ...l ? {premium:{N:!0, P:parseFloat(h), EapFee:parseFloat(g)}} : {}})));
    } catch (t) {
      const {props:x = {}, message:y} = t;
      c = x.Number;
      2515610 == c ? (console.warn("[!] Bug: cannot register a premium with Eap."), console.warn(" -  Response when requesting w/out EapFee:"), console.log("    %s", y)) : /No free connections to registry./.test(y) ? (console.log("    %s", y), console.log("Please try again.")) : 3028166 == c && (console.warn("[!] Possible Bug (e.g., after sending without Eap)"), console.log("    %s", y));
      throw t;
    }
    console.log("Successfully registered %s! Charged amount: $%s.", M(b, "green"), Number(q).toFixed(2));
  }
}
const ud = ({FirstName:a, LastName:b, Address1:c, Address2:d, City:e, Zip:f, Country:g, EmailAddress:h}) => {
  a = jd(`${a} ${b}, ${h}
 ${c}${d ? `\n ${d}` : ""}
 ${e}
 ${f}, ${g}`);
  console.log(a);
};
async function vd(a, b) {
  let {hosts:c, IsUsingOurDNS:d} = await a.dns.getHosts(b);
  if (!d) {
    throw Error(`Namecheap DNS is not being used for ${b}`);
  }
  c.reduce(async(f, {Type:g, Name:h, Address:k}) => {
    await f;
    "A" == g && "@" == h && (await L(`An A record at @ (${k}) already exists. Continue?`) || process.exit());
  }, {});
  c = c.filter(({Type:f, Name:g, Address:h}) => "www" == g && "CNAME" == f && "parkingpage.namecheap.com." == h || "@" == g && "URL" == f ? !1 : !0);
  const e = c.map(f => ({TTL:f.TTL, RecordType:f.Type, Address:f.Address, HostName:f.Name, MXPref:f.MXPref}));
  e.push({Address:"185.199.108.153", RecordType:"A", HostName:"@"}, {Address:"185.199.109.153", RecordType:"A", HostName:"@"}, {Address:"185.199.110.153", RecordType:"A", HostName:"@"}, {Address:"185.199.111.153", RecordType:"A", HostName:"@"});
  if (!(await X(`Setting ${M(`${e.length}`, "yellow")} host records`, async() => await a.dns.setHosts(b, e))).IsSuccess) {
    throw Error("Operation wasn't successful.");
  }
}
;const wd = async a => await new Promise((b, c) => {
  fb(a, d => {
    d && "ENOENT" == d.code ? b(!1) : d ? c(d) : b(!0);
  });
});
async function xd(a, b, c) {
  a = await zb(a, c);
  await F(b, a, {space:2});
  return a;
}
;async function yd(a, b = {}, c = {}) {
  if ("string" != typeof a) {
    throw Error("Package name is required.");
  }
  const {homedir:d = v(), rcNameFunction:e = l => `.${l}rc`, force:f = !1, local:g = !1, questionsTimeout:h} = c;
  var k = e(a);
  a = ed(d, k);
  c = await wd(a);
  if (g) {
    k = ed(k);
    const l = await wd(k);
    return await zd(c, l, a, k, b, h, f);
  }
  return await Ad(c, a, b, h, f);
}
const Ad = async(a, b, c, d, e) => a ? await Bd(b, c, e, d) : await xd(c, b, d), Bd = async(a, b, c, d) => {
  const e = await F(a);
  return c ? await Cd(b, a, e, d) : e;
}, zd = async(a, b, c, d, e, f, g) => b ? await Bd(d, e, g, f) : (a = a ? await F(c) : {}, await Cd(e, d, a, f)), Cd = async(a, b, c, d) => {
  a = Dd(a, c);
  return await xd(a, b, d);
}, Dd = (a, b) => Object.keys(a).reduce((c, d) => {
  const e = b[d];
  return {...c, [d]:{...a[d], ...e ? {defaultValue:e} : {}}};
}, {});
var Ed = {ApiUser:{text:"Username", validation:a => {
  if (!a) {
    throw Error("Please enter the namecheap username.");
  }
}}, ApiKey:{text:"Api key https://ap.www.namecheap.com/settings/tools/apiaccess/", validation:a => {
  if (!a) {
    throw Error("Please provide the namecheap api key.");
  }
}}, ClientIp:{text:"Client ip", getDefault:Q.LOOKUP_IP}, phone:{text:"Last 3 digit of phone to use for 2 factor auth"}};
const Fd = p("expensive"), Gd = async() => {
  const a = Sc(Y);
  Fd("Reading %s rc", a);
  const {ApiUser:b, ApiKey:c, ClientIp:d, phone:e} = await yd(a, Ed);
  if (!b) {
    throw Error("Api User is missing");
  }
  if (!c) {
    throw Error("Api Key is missing");
  }
  return {ApiUser:b, ApiKey:c, ClientIp:d, phone:e};
};
const Hd = p("expensive"), Id = async(a, b, c) => {
  c = c || await Q.LOOKUP_IP();
  const d = await K({text:`Enter the password to white-list ${c}`, validation(f) {
    if (!f) {
      throw Error("Please enter the password.");
    }
  }, password:!0}), e = new Q({sandbox:b});
  await e.auth(a.ApiUser, d, a.phone);
  await e.whitelistIP(c);
  b = Sc(b);
  b = dd(v(), `.${b}rc`);
  Hd("Writing to %s", b);
  await F(b, {...a, ClientIp:c});
};
var Jd = {1:"Requesting white-listing of the IP address.", 1011150:"Parameter RequestIP is invalid", 2030166:"Domain is invalid", 2011170:"PromotionCode is invalid"};
const Kd = a => [["Domain Name", "name", "string", (b, c) => `${b}: ${c}`], ["Registrar URL", "url", "string", (b, c) => `${b}: ${c}`], ["Updated Date", "updated", "date", (b, c, d) => `${b}: ${c} (${d} ${1 == d ? "day" : "days"} ago)`], ["Creation Date", "created", "date", (b, c, d) => `${b}: ${c} (${d} ${1 == d ? "day" : "days"} ago)`], ["Registry Expiry Date", "expire", "date", (b, c, d) => `${b}: ${c} (in ${-d} ${1 == -d ? "day" : "days"})`], ["Name Server", "ns", "array", (b, c) => `${b}: ${c}`]].reduce((b, 
[c, d, e, f]) => {
  try {
    const h = "date" == e;
    e = "array" == e;
    const k = new RegExp(`^${c}: (.+)`, "mg"), l = [];
    let n;
    for (; null !== (n = k.exec(a));) {
      const [, u] = n;
      l.push(h ? new Date(u) : u);
    }
    const m = e ? l.join("\n ") : l[0], r = f(c, h ? m.toLocaleString() : m, h ? Math.round(((new Date).getTime() - m.getTime()) / 864E5) : null);
    var g = {[d]:r};
  } catch (h) {
    g = {};
  }
  return {...b, ...g};
}, {});
var Ld = async() => {
  var a = await Q.WHOIS(U);
  if (nc) {
    return console.log(a);
  }
  a = Kd(a);
  Object.values(a).forEach(b => console.log(b));
};
const Md = async() => {
  await yd(Sc(Y), Ed, {force:!0});
};
async function Nd(a, b) {
  const [c, d] = await X(`Fetching info and DNS data for ${M(b, "yellow")}`, Promise.all([a.domains.getInfo(b), a.dns.getHosts(b)]));
  {
    a = c.DomainDetails;
    b = c.Whoisguard;
    const e = c.DnsDetails;
    a = [{name:"Created:", value:a.CreatedDate}, {name:"Expires on:", value:a.ExpiredDate}, {name:"Whois enabled:", value:b.Enabled}, ...b.EmailDetails ? [{name:"Whois email:", value:b.EmailDetails.ForwardedTo}] : [], {name:"DNS:", value:"FREE" == c.DnsDetails.ProviderType ? M(e.ProviderType, "green") : e.ProviderType}, {name:"Nameservers:", value:e.Nameserver.join(", ")}, {name:"Created:", value:a.CreatedDate}];
    a = V({data:a, keys:["name", "value"]});
    [, ...a] = a.split("\n");
    a = a.join("\n");
    console.log(a);
  }
  d.IsUsingOurDNS && (console.log(), console.log(V({headings:["Name", "Type", "Address"], data:d.hosts, keys:["Name", "Type", "Address"]})));
}
;async function Od() {
  const a = await (Y ? Q.SANDBOX_COUPON() : Q.COUPON());
  console.log(a);
}
;const Pd = a => a.map(b => ({TTL:b.TTL, RecordType:b.Type, Address:b.Address, HostName:b.Name, MXPref:b.MXPref}));
async function Qd(a, b) {
  var c = await X("Getting current hosts", async() => {
    const {hosts:g, IsUsingOurDNS:h} = await a.dns.getHosts(b);
    if (!h) {
      throw Error(`Namecheap DNS is not being used for ${b}`);
    }
    return g;
  });
  let d = Pd(c);
  c = Bc;
  var e = vc;
  yc ? (e = "CNAME", c = yc) : wc ? (e = "TXT", c = wc) : xc && (e = "A", c = xc);
  const f = Object.entries({RecordType:e, Address:c, HostName:Ac, TTL:zc, MXPref:Cc}).reduce((g, [h, k]) => {
    k && (g[h] = k);
    return g;
  }, {});
  c = aa(f, {colors:!0, breakLength:50, compact:!1});
  if (Ec) {
    e = d.length;
    d = d.filter(g => Object.entries(f).some(([h, k]) => k != g[h]));
    if (d.length == e) {
      console.log("Host %s not found. Existing hosts:", c);
      console.log();
      Rd(d);
      return;
    }
    if (!await L(`Are you sure you want to unset ${c}`)) {
      return;
    }
  } else {
    d.push(f);
  }
  if (!(await X(`Setting ${M(`${d.length}`, "yellow")} host records`, async() => await a.dns.setHosts(b, d))).IsSuccess) {
    throw Error("Operation wasn't successful.");
  }
  console.log("Successfully %s %s on %s.", Ec ? "deleted" : "set", c, M(b, "yellow"));
  c = await X("Fetching updated hosts", async() => {
    const {hosts:g, IsUsingOurDNS:h} = await a.dns.getHosts(b);
    if (!h) {
      throw Error(`Namecheap DNS is not being used for ${b}`);
    }
    return g;
  });
  console.log();
  Rd(Pd(c));
}
const Rd = a => {
  console.log(V({headings:{HostName:"Name", RecordType:"Type"}, data:a.map(b => {
    b.TTL || (b.TTL = "-");
    return b;
  }), centerHeadings:["Address", "TTL"], keys:["HostName", "RecordType", "Address", "TTL"], replacements:{Address(b) {
    b = b.replace(/(.{37})/g, "$1\n").trim();
    return {value:b, length:Math.min(b.length, 37)};
  }}}));
};
const Sd = require("../../package.json").version, Y = pc || !!process.env.SANDBOX, Z = p("expensive"), Td = /expensive/.test(process.env.NODE_DEBUG);
if (rc) {
  console.log(Sd), process.exit();
} else {
  if (sc) {
    var Ud;
    {
      const a = R({usage:S(ec), description:M("expensive", "yellow") + "\nA CLI application to access namecheap.com domain name registrar API."}), b = R({usage:{}, description:M("expensive domain.com --info", "magenta") + "\nDisplay the information about the domain on the account.\nAlso displays DNS hosts if using Namecheap's DNS."}).trim() + "\n", c = R({description:M("expensive", "red") + "\nPrint the list of domains belonging to the account.", usage:S(hc)}), d = R({description:M('expensive domain.com [--record A] [--TXT|A|CNAME|address 10.10.10.10] [--host "*"]...', 
      "cyan") + "\nManipulate DNS Records.", usage:Uc()}), e = R({description:M("expensive domain.com -r [-p PROMO]", "green") + "\nRegister the domain name. Expensive will attempt to find the promo\ncode online, and compare its price to the normal price.", usage:S(ic)}), f = R({description:M("expensive domain|domain.com [domain.org] [-f] [-z app,page]", "blue") + `
Check domains for availability. When no TLD is given,
${Tc} are checked.`, usage:S(fc)});
      Ud = [a, b, c, d, e, f].join("\n");
    }
    console.log(Ud);
    process.exit();
  }
}
const Wd = async(a, b = !1) => {
  try {
    if (qc) {
      return await Id(a, b);
    }
    var c = a.ClientIp || await Q.LOOKUP_IP();
    const d = new bb({user:a.ApiUser, key:a.ApiKey, ip:c, sandbox:b});
    if (!U) {
      return await ad(d, {sort:Fc, desc:Gc, filter:Hc, type:Jc, pageSize:Ic});
    }
    [c] = U;
    if (vc || yc || wc || xc) {
      return await Qd(d, c);
    }
    if (Dc) {
      return await vd(d, c);
    }
    if (kc) {
      return await Nd(d, c);
    }
    if (lc) {
      return await td(d, {domain:c, promo:Kc, sandbox:b, years:Lc});
    }
    await fd(d);
  } catch (d) {
    await Vd(d, a, b);
  }
}, Vd = async({stack:a, message:b, props:c}, d, e) => {
  c && (Z(aa(c, {colors:!0})), Z(Jd[c.Number]));
  if (c && 1011150 == c.Number) {
    try {
      const [, f] = /Invalid request IP: (.+)/.exec(b) || [];
      await Id(d, e, f);
    } catch ({message:f, stack:g}) {
      console.log("Could not white-list IP."), Td ? Z(g) : console.error(f), process.exit(1);
    }
    return Wd(d, e);
  }
  Td ? Z(a) : console.error(b);
  process.exit(1);
};
(async() => {
  try {
    if (oc) {
      return await Od();
    }
    if (mc || nc) {
      return await Ld();
    }
    if (jc) {
      return await Md();
    }
  } catch (b) {
    var a = b.stack;
    const c = b.message;
    Td ? Z(a) : console.error(c);
    return;
  }
  a = await Gd();
  await Wd(a, Y);
})();


//# sourceMappingURL=expensive.js.map