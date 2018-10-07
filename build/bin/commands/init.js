let africa = require('africa'); if (africa && africa.__esModule) africa = africa.default;
const { getAppName } = require('../../lib');
let questions = require('../../questions'); if (questions && questions.__esModule) questions = questions.default;

const initConfig = async (sandbox) => {
  const n = getAppName(sandbox)
  await africa(n, questions, { force: true })
}

module.exports=initConfig