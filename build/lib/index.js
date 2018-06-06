"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeStartupyList = exports.isSingleWord = exports.startupyDomains = exports.validateDomains = void 0;

const validateDomains = arr => arr.reduce((acc, current) => {
  return acc && typeof current == 'string';
}, true);

exports.validateDomains = validateDomains;
const startupyDomains = ['.co', '.cc', '.io', '.bz', '.app'];
exports.startupyDomains = startupyDomains;

const isSingleWord = d => !/\./.test(d);

exports.isSingleWord = isSingleWord;

const makeStartupyList = d => startupyDomains.map(s => `${d}${s}`);

exports.makeStartupyList = makeStartupyList;
//# sourceMappingURL=index.js.map