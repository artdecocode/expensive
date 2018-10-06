import africa from 'africa'
import { getAppName } from '../../lib'
import questions from '../../questions'

const initConfig = async (sandbox) => {
  const n = getAppName(sandbox)
  await africa(n, questions, { force: true })
}

export default initConfig