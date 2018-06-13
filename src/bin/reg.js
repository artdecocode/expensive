import { askSingle } from 'reloquent'
import printList from '../lib/print/list'
import { getAddressList, getAddressInfo } from '..'

export default async function register(Auth, {
  domain,
  // sort,
  // desc,
  // filter,
  // type,
  // pageSize,
}) {
  const { defaultId } = await getAddressList(Auth)
  const address = await getAddressInfo(Auth, { id: defaultId })
  // printList(domains)
  // if (CurrentPage * PageSize < TotalItems) {
  //   const t = `${CurrentPage}/${Math.ceil(TotalItems/PageSize)}`
  //   const answer = await askSingle({
  //     text: `Page ${t}. Display more`,
  //     defaultValue: 'y',
  //   })
  //   if (answer == 'y') {
  //     await list(Auth, {
  //       page: CurrentPage + 1,
  //       sort,
  //       desc,
  //       filter,
  //       type,
  //     })
  //   }
  // }
}
