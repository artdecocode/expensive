import query from '../../../lib/query'
import { extractTag } from '../..'

const GET_LIST = 'namecheap.domains.getList'

const m = {
  name: 'name',
  expire: 'expiredate',
  create: 'createdate',
}

/**
 * @param {string} sort
 */
const getSort = (sort, desc) => {
  if (!['name', 'expire', 'create'].includes(sort.toLowerCase())) {
    throw new Error(`Unknown sort by option: ${sort}.`)
  }
  const s = m[sort].toUpperCase()
  if (desc) return `${s}_DESC`
  return s
}

/**
 * @param {string} domain a domain name to view info for.
 */
const getInfo = async (Auth = {}, {
  page,
  // size,
  sort,
  desc,
  filter,
  type,
  pageSize,
} = {}) => {
  const res = await query({
    ...Auth,
  }, GET_LIST, {
    ...(page ? { Page: page }: {}),
    ...(pageSize ? { PageSize: pageSize } : {}),
    ...(sort ? { SortBy: getSort(sort, desc) } : { SortBy: getSort('create', 'desc') }),
    ...(filter ? { SearchTerm: filter } : {}),
    ...(type ? { ListType: type } : {}),
  })
  const Domain = extractTag('Domain', res)
  const domains = Domain.map(({ props }) => props)
  const [{ content: Paging }] = extractTag('Paging', res)
  const [{ content: TotalItems }] = extractTag('TotalItems', Paging)
  const [{ content: CurrentPage }] = extractTag('CurrentPage', Paging)
  const [{ content: PageSize }] = extractTag('PageSize', Paging)
  return {
    domains,
    TotalItems: parseInt(TotalItems, 10),
    CurrentPage: parseInt(CurrentPage, 10),
    PageSize: parseInt(PageSize, 10),
  }
}

export default getInfo
