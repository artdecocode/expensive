import spawn from 'spawncommand'

/**
 * Push code and return the latest commit message
 */
export const push = async () => {
  const { promise } = spawn('git', ['push'])
  const { stdout, stderr } = await promise
}
