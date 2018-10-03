import { askSingle } from 'reloquent'
import printList from '../../lib/print/list'

/** @param {Namecheap} nc */
export default async function list(nc, {
  sort,
  desc,
  page,
  filter,
  type,
  pageSize,
} = {}) {
  const { domains, CurrentPage, PageSize, TotalItems } = await nc.domains.getList({
    page,
    sort,
    desc,
    filter,
    type,
    pageSize,
  })
  printList(domains)
  if (CurrentPage * PageSize < TotalItems) {
    const t = `${CurrentPage}/${Math.ceil(TotalItems/PageSize)}`
    const answer = await askSingle({
      text: `Page ${t}. Display more`,
      defaultValue: 'y',
    })
    if (answer == 'y') {
      await list(nc, {
        page: CurrentPage + 1,
        sort,
        desc,
        filter,
        type,
        pageSize,
      })
    }
  }
}
