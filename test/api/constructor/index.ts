import assert from 'assert-diff'
import {TestSuite} from '../../utils'
import {AitdAPI} from 'aitd-api'

/**
 * Every test suite exports their tests in the default object.
 * - Check out the "TestSuite" type for documentation on the interface.
 * - Check out "test/api/index.ts" for more information about the test runner.
 */
export default <TestSuite>{
  'AitdAPI - implicit server port': () => {
    new AitdAPI({server: 'wss://s1.aitd.com'})
  },

  'AitdAPI invalid options': () => {
    // @ts-ignore - This is intentionally invalid
    assert.throws(() => new AitdAPI({invalid: true}))
  },

  'AitdAPI valid options': () => {
    const api = new AitdAPI({server: 'wss://s:1'})
    const privateConnectionUrl = (api.connection as any)._url
    assert.deepEqual(privateConnectionUrl, 'wss://s:1')
  },

  'AitdAPI invalid server uri': () => {
    assert.throws(() => new AitdAPI({server: 'wss//s:1'}))
  }
}
