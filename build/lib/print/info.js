"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _erte = require("erte");

var _Namecheap = require("../../Namecheap");

// eslint-disable-line

/** @param {DomainInfo} info */
const printInfo = info => {
  console.log('Created:\t%s', info.DomainDetails.CreatedDate);
  console.log('Expires on:\t%s', info.DomainDetails.ExpiredDate);
  console.log('Whois enabled:\t%s', info.Whoisguard.Enabled);
  if (info.Whoisguard.EmailDetails) console.log('Whois email:\t%s', info.Whoisguard.EmailDetails.ForwardedTo);
  console.log('DNS:\t\t%s', (0, _erte.c)(info.DnsDetails.ProviderType, info.DnsDetails.ProviderType == 'FREE' ? 'red' : 'green'));
  console.log('Nameservers:\t%s', info.DnsDetails.Nameserver.join(', '));
};

var _default = printInfo;
exports.default = _default;
//# sourceMappingURL=info.js.map