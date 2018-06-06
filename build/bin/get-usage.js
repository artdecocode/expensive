"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lib = require("../lib");

const l = _lib.startupyDomains.join(', ');

const u = {
  domain: `check a domain name in various startupy zones\n(${l})`,
  'domain.com': 'check a domain name' // 'domain1.com domain2.com': 'check multiple domain names',

};
const commands = Object.keys(u);
const descriptions = Object.values(u);

var _default = () => {
  const [commandLength] = commands.reduce(([longestName = 0, longestDescription = 0], name) => {
    /** @type {string} */
    const command = u[name];
    const theLongest = command.split('\n').reduce((acc, c) => {
      if (c.length > acc) return c.length;
      return acc;
    }, 0);
    if (theLongest > longestDescription) longestDescription = theLongest;
    if (name.length > longestName) longestName = name.length;
    return [longestName, longestDescription];
  }, []);

  const pad = (string, length) => {
    const l = length - string.length;
    const t = Array.from({
      length: l
    });
    const ts = t.map(_ => ' ').join(''); // eslint-disable-line no-unused-vars

    const s = `${string}${ts}`;
    return s;
  };

  const usa = commands.reduce((acc, command, i) => {
    const value = descriptions[i];
    const vals = value.split('\n');
    const c = pad(command, commandLength);
    const [firstVal, ...otherVals] = vals;
    const firstLine = `${c}\t${firstVal}`;
    const emptyPad = pad('', commandLength);
    const otherLines = otherVals.map(val => {
      const r = `${emptyPad}\t${val}`;
      return r;
    });
    const res = [...acc, firstLine, ...otherLines];
    return res;
  }, []);
  const USA = usa.map(a => `\t${a}`);
  const usage = `Usage:
  expensive
${USA.join('\n')}
`.trim();
  return usage;
};

exports.default = _default;
//# sourceMappingURL=get-usage.js.map