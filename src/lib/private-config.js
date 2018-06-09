import africa from 'africa'
import { privateQuestions } from '../questions'

/**
 * @typedef  {Object} AppConfig
 * @property {string} DefaultPhone Last 3 digits of the phone number
 */

export default async () => {
  const {
    aws_id,
    aws_key,
    phone,
  } = await africa('expensive-client', privateQuestions)
  return {
    aws_id,
    aws_key,
    phone,
  }
}
