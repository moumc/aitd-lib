/**
 * AITD Ledger namespace prefixes.
 *
 * The AITD Ledger is a key-value store. In order to avoid name collisions,
 * names are partitioned into namespaces.
 *
 * Each namespace is just a single character prefix.
 *
 * See [LedgerNameSpace enum](https://github.com/aitd/aitdd/blob/master/src/aitd/protocol/LedgerFormats.h#L100)
 */
export default {
  account: 'a',
  dirNode: 'd',
  generatorMap: 'g',
  aitdState: 'r',
  offer: 'o', // Entry for an offer.
  ownerDir: 'O', // Directory of things owned by an account.
  bookDir: 'B', // Directory of order books.
  contract: 'c',
  skipList: 's',
  escrow: 'u',
  amendment: 'f',
  feeSettings: 'e',
  ticket: 'T',
  signerList: 'S',
  paychan: 'x',
  check: 'C',
  depositPreauth: 'p'
}
