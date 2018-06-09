"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.privateQuestions = exports.default = void 0;

var _rqt = _interopRequireDefault(require("rqt"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  ApiUser: {
    text: 'username: ',
    validation: a => {
      if (!a) throw new Error('Please enter the namecheap username.');
    }
  },
  ApiKey: {
    text: 'api key https://ap.www.namecheap.com/settings/tools/apiaccess/: ',
    validation: a => {
      if (!a) throw new Error('Please provide the namecheap api key.');
    }
  },
  ClientIp: {
    text: 'client ip',

    // validation: a => { if (!a) throw new Error('Please give the Client Ip and whitelist it.') },
    async getDefault() {
      const ip = await (0, _rqt.default)('https://api.ipify.org');
      return ip;
    }

  }
};
exports.default = _default;
const privateQuestions = {
  phone: {
    text: 'Last 3 digit of phone to use for 2 factor auth: '
  },
  aws_id: {
    text: 'AWS access key id: ',
    validation: a => {
      if (!a) console.warn('without aws key the route 53 updates won\'t work');
    }
  },
  aws_key: {
    text: 'AWS secret access key: ',
    validation: a => {
      if (!a) console.warn('without aws key the route 53 updates won\'t work');
    }
  }
};
exports.privateQuestions = privateQuestions;
//# sourceMappingURL=questions.js.map