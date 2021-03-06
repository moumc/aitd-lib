import assert from 'assert-diff'
import {TestSuite} from '../../utils'

/**
 * Every test suite exports their tests in the default object.
 * - Check out the "TestSuite" type for documentation on the interface.
 * - Check out "test/api/index.ts" for more information about the test runner.
 */
export default <TestSuite>{
  'AitdError with data': async (api, address) => {
    const error = new api.errors.AitdError('_message_', '_data_')
    assert.strictEqual(error.toString(), "[AitdError(_message_, '_data_')]")
  },

  'NotFoundError default message': async (api, address) => {
    const error = new api.errors.NotFoundError()
    assert.strictEqual(error.toString(), '[NotFoundError(Not found)]')
  }
}
