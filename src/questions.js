export default {
  ApiUser: {
    text: 'username: ',
    validation: a => { if (!a) throw new Error('Please enter the namecheap username.') },
  },
  ApiKey: {
    text: 'api key https://ap.www.namecheap.com/settings/tools/apiaccess/: ',
    validation: a => { if (!a) throw new Error('Please provide the namecheap api key.') },
  },
  ClientIp: {
    text: 'client ip https://www.google.co.uk/search?q=my+ip: ',
    validation: a => { if (!a) throw new Error('Please give the Client Ip and whitelist it.') },
  },
}
