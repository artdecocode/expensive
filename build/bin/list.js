"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = list;

var _reloquent = require("reloquent");

var _list = _interopRequireDefault(require("../lib/print/list"));

var _Namecheap = _interopRequireDefault(require("../Namecheap"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eslint-disable-line

/** @param {Namecheap} nc */
async function list(nc, {
  sort,
  desc,
  page,
  filter,
  type,
  pageSize
} = {}) {
  const {
    domains,
    CurrentPage,
    PageSize,
    TotalItems
  } = await nc.domains.getList({
    page,
    sort,
    desc,
    filter,
    type,
    pageSize
  });
  (0, _list.default)(domains);

  if (CurrentPage * PageSize < TotalItems) {
    const t = `${CurrentPage}/${Math.ceil(TotalItems / PageSize)}`;
    const answer = await (0, _reloquent.askSingle)({
      text: `Page ${t}. Display more`,
      defaultValue: 'y'
    });

    if (answer == 'y') {
      await list(nc, {
        page: CurrentPage + 1,
        sort,
        desc,
        filter,
        type,
        pageSize
      });
    }
  }
}
//# sourceMappingURL=list.js.map