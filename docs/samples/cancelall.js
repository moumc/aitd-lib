'use strict';
const AitdAPI = require('../../dist/npm').AitdAPI; // require('aitd-lib')

const address = 'rLDYrujdKUfVx28T9vRDAbyJ7G2WVXKo4K';
const secret = '';

const api = new AitdAPI({server: 'wss://s1.aitd.com:443'});
const instructions = {maxLedgerVersionOffset: 5};

function fail(message) {
  console.error(message);
  process.exit(1);
}

function cancelOrder(orderSequence) {
  console.log('Cancelling order: ' + orderSequence.toString());
  return api.prepareOrderCancellation(address, {orderSequence}, instructions)
  .then(prepared => {
    const signing = api.sign(prepared.txJSON, secret);
    return api.submit(signing.signedTransaction);
  });
}

function cancelAllOrders(orderSequences) {
  if (orderSequences.length === 0) {
    return Promise.resolve();
  }
  const orderSequence = orderSequences.pop();
  return cancelOrder(orderSequence).then(() => cancelAllOrders(orderSequences));
}

api.connect().then(() => {
  console.log('Connected...');
  return api.getOrders(address).then(orders => {
    const orderSequences = orders.map(order => order.properties.sequence);
    return cancelAllOrders(orderSequences);
  }).then(() => process.exit(0));
}).catch(fail);
