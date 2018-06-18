"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getList;

var _query = _interopRequireDefault(require("../../../lib/query"));

var _ = require("../..");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const GET_LIST = 'namecheap.domains.getList';
const m = {
  name: 'name',
  expire: 'expiredate',
  create: 'createdate'
  /**
   * @param {string} sort
   */

};

const getSort = (sort, desc) => {
  if (!['name', 'expire', 'create'].includes(sort.toLowerCase())) {
    throw new Error(`Unknown sort by option: ${sort}.`);
  }

  const s = m[sort].toUpperCase();
  if (desc) return `${s}_DESC`;
  return s;
};

async function getList(Auth = {}, {
  page,
  sort,
  desc,
  filter,
  type,
  pageSize
} = {}) {
  const res = await (0, _query.default)({ ...Auth
  }, GET_LIST, { ...(page ? {
      Page: page
    } : {}),
    ...(pageSize ? {
      PageSize: pageSize
    } : {}),
    ...(sort ? {
      SortBy: getSort(sort, desc)
    } : {
      SortBy: getSort('create', 'desc')
    }),
    ...(filter ? {
      SearchTerm: filter
    } : {}),
    ...(type ? {
      ListType: type
    } : {})
  });
  const Domain = (0, _.extractTag)('Domain', res);
  const domains = Domain.map(({
    props
  }) => props);
  const [{
    content: Paging
  }] = (0, _.extractTag)('Paging', res);
  const [{
    content: TotalItems
  }] = (0, _.extractTag)('TotalItems', Paging);
  const [{
    content: CurrentPage
  }] = (0, _.extractTag)('CurrentPage', Paging);
  const [{
    content: PageSize
  }] = (0, _.extractTag)('PageSize', Paging);
  return {
    domains,
    TotalItems: parseInt(TotalItems, 10),
    CurrentPage: parseInt(CurrentPage, 10),
    PageSize: parseInt(PageSize, 10)
  };
}
//# sourceMappingURL=get-list.js.map