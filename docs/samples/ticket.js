'use strict';
const AitdAPI = require('../../src').AitdAPI; // require('aitd-lib')

const address = 'INSERT ADDRESS HERE';
const secret = 'INSERT SECRET HERE';

const api = new AitdAPI({server: 'wss://s1.aitd.com:443'});
const instructions = {
  maxLedgerVersionOffset: 5
};
const numberOfTickets = 1;

function quit(message) {
  console.log(message);
  process.exit(0);
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

api.connect().then(() => {
  console.log('Connected...');
  return api.prepareTicketCreate(address, numberOfTickets, instructions).then(prepared => {
    console.log('Ticket transaction prepared...');
    const {signedTransaction} = api.sign(prepared.txJSON, secret);
    console.log('Ticket transaction signed...');
    api.submit(signedTransaction).then(quit, fail);
  });
}).catch(fail);
