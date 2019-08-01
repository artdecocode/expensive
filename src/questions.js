import NamecheapWeb from '@rqt/namecheap-web'

export default {
  ApiUser: {
    text: 'Username',
    validation: a => {
      if (!a) throw new Error('Please enter the namecheap username.')
    },
  },
  ApiKey: {
    text: 'Api key https://ap.www.namecheap.com/settings/tools/apiaccess/',
    validation: a => {
      if (!a) throw new Error('Please provide the namecheap api key.')
    },
  },
  ClientIp: {
    text: 'Client ip',
    // validation: a => { if (!a) throw new Error('Please give the Client Ip and whitelist it.') },
    getDefault: NamecheapWeb.LOOKUP_IP,
  },
  phone: {
    text: 'Last 3 digit of phone to use for 2 factor auth',
  },
}

// export const privateQuestions = {
//   aws_id: {
//     text: 'AWS access key id',
//     validation: a => { if (!a) console.warn('without aws key the route 53 updates won\'t work' ) },
//   },
//   aws_key: {
//     text: 'AWS secret access key',
//     validation: a => { if (!a) console.warn('without aws key the route 53 updates won\'t work' ) },
//   },
// }
