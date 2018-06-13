import query from '../../../lib/query'
import { extractTag } from '../..'

const GET_LIST = 'namecheap.domains.getList'

/**
 * @param {string} domain a domain name to view info for.
 */
const getInfo = async (Auth = {}, Page) => {
  const res = await query({
    ...Auth,
  }, GET_LIST, Page ? { Page } : {})
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
