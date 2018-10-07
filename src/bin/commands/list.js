import { confirm } from 'reloquent'
import printList from '../../lib/print/list'

/** @param {import('@rqt/namecheap')} nc */
export default async function list(nc, {
  sort,
  desc,
  page,
  filter,
  type,
  pageSize,
} = {}) {
  const { domains, ...pagination } = await nc.domains.getList({
    page,
    sort,
    desc,
    filter,
    type,
    pageSize,
  })
  printList(domains)
  const nextPage = getNextPage(pagination)
  if (nextPage) {
    const t = getNavigation(pagination)
    const answer = await confirm(`Page ${t}. Display more`)
    if (answer) {
      await list(nc, {
        page: nextPage,
        sort,
        desc,
        filter,
        type,
        pageSize,
      })
    }
  }
}

const getNextPage = ({ CurrentPage, TotalItems, PageSize }) => {
  if (CurrentPage * PageSize < TotalItems) {
    return CurrentPage + 1
  }
}

const getNavigation = ({ CurrentPage, TotalItems, PageSize }) => {
  return `${CurrentPage}/${Math.ceil(TotalItems/PageSize)}`
}
