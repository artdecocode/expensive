import { askSingle } from 'reloquent'
import printList from '../lib/print/list'
import { getList } from '..'

export default async function list(Auth, {
  page,
  sort,
  desc,
  filter,
  type,
  pageSize,
}) {
  const { CurrentPage, PageSize, TotalItems, domains } = await getList(Auth, {
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
      await list(Auth, {
        page: CurrentPage + 1,
        sort,
        desc,
        filter,
        type,
      })
    }
  }
}
