"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
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
    text: 'client ip https://www.google.co.uk/search?q=my+ip: ',
    validation: a => {
      if (!a) throw new Error('Please give the Client Ip and whitelist it.');
    }
  },
  DefaultPhone: {
    text: 'last 3 digit of phone to use for 2 factor auth: '
  },
  AWS_id: {
    text: 'aws_access_key_id',
    validation: a => {
      if (!a) console.warn('without aws key the route 53 updates won\'t work');
    }
  },
  AWS_key: {
    text: 'aws_secret_access_key',
    validation: a => {
      if (!a) console.warn('without aws key the route 53 updates won\'t work');
    }
  }
};
exports.default = _default;
//# sourceMappingURL=questions.js.map