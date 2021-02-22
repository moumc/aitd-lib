'use strict';
const AitdAPI = require('../../src').AitdAPI; // require('aitd-lib')

const api = new AitdAPI({server: 'wss://s1.aitd.com:443'});
const address = 'r3kmLJN5D28dHuH8vZNUZpMC43pEHpaocV';

api.connect().then(() => {
  api.getBalances(address).then(balances => {
    console.log(JSON.stringify(balances, null, 2));
    process.exit();
  });
});
