import assert from 'assert-diff'
import {TestSuite} from '../../utils'
import BigNumber from 'bignumber.js'

/**
 * Every test suite exports their tests in the default object.
 * - Check out the "TestSuite" type for documentation on the interface.
 * - Check out "test/api/index.ts" for more information about the test runner.
 */
export default <TestSuite>{
  'works with a typical amount': async (api) => {
    const aitd = api.dropsToAitd('2000000')
    assert.strictEqual(aitd, '2', '2 million drops equals 2 AITD')
  },
  'works with fractions': async (api) => {
    let aitd = api.dropsToAitd('3456789')
    assert.strictEqual(aitd, '3.456789', '3,456,789 drops equals 3.456789 AITD')

    aitd = api.dropsToAitd('3400000')
    assert.strictEqual(aitd, '3.4', '3,400,000 drops equals 3.4 AITD')

    aitd = api.dropsToAitd('1')
    assert.strictEqual(aitd, '0.000001', '1 drop equals 0.000001 AITD')

    aitd = api.dropsToAitd('1.0')
    assert.strictEqual(aitd, '0.000001', '1.0 drops equals 0.000001 AITD')

    aitd = api.dropsToAitd('1.00')
    assert.strictEqual(aitd, '0.000001', '1.00 drops equals 0.000001 AITD')
  },
  'works with zero': async (api) => {
    let aitd = api.dropsToAitd('0')
    assert.strictEqual(aitd, '0', '0 drops equals 0 AITD')

    // negative zero is equivalent to zero
    aitd = api.dropsToAitd('-0')
    assert.strictEqual(aitd, '0', '-0 drops equals 0 AITD')

    aitd = api.dropsToAitd('0.00')
    assert.strictEqual(aitd, '0', '0.00 drops equals 0 AITD')

    aitd = api.dropsToAitd('000000000')
    assert.strictEqual(aitd, '0', '000000000 drops equals 0 AITD')
  },
  'works with a negative value': async (api) => {
    const aitd = api.dropsToAitd('-2000000')
    assert.strictEqual(aitd, '-2', '-2 million drops equals -2 AITD')
  },
  'works with a value ending with a decimal point': async (api) => {
    let aitd = api.dropsToAitd('2000000.')
    assert.strictEqual(aitd, '2', '2000000. drops equals 2 AITD')

    aitd = api.dropsToAitd('-2000000.')
    assert.strictEqual(aitd, '-2', '-2000000. drops equals -2 AITD')
  },
  'works with BigNumber objects': async (api) => {
    let aitd = api.dropsToAitd(new BigNumber(2000000))
    assert.strictEqual(aitd, '2', '(BigNumber) 2 million drops equals 2 AITD')

    aitd = api.dropsToAitd(new BigNumber(-2000000))
    assert.strictEqual(aitd, '-2', '(BigNumber) -2 million drops equals -2 AITD')

    aitd = api.dropsToAitd(new BigNumber(2345678))
    assert.strictEqual(
      aitd,
      '2.345678',
      '(BigNumber) 2,345,678 drops equals 2.345678 AITD'
    )

    aitd = api.dropsToAitd(new BigNumber(-2345678))
    assert.strictEqual(
      aitd,
      '-2.345678',
      '(BigNumber) -2,345,678 drops equals -2.345678 AITD'
    )
  },
  'works with a number': async (api) => {
    // This is not recommended. Use strings or BigNumber objects to avoid precision errors.
    let aitd = api.dropsToAitd(2000000)
    assert.strictEqual(aitd, '2', '(number) 2 million drops equals 2 AITD')
    aitd = api.dropsToAitd(-2000000)
    assert.strictEqual(aitd, '-2', '(number) -2 million drops equals -2 AITD')
  },
  'throws with an amount with too many decimal places': async (api) => {
    assert.throws(() => {
      api.dropsToAitd('1.2')
    }, /has too many decimal places/)

    assert.throws(() => {
      api.dropsToAitd('0.10')
    }, /has too many decimal places/)
  },
  'throws with an invalid value': async (api) => {
    assert.throws(() => {
      api.dropsToAitd('FOO')
    }, /invalid value/)

    assert.throws(() => {
      api.dropsToAitd('1e-7')
    }, /invalid value/)

    assert.throws(() => {
      api.dropsToAitd('2,0')
    }, /invalid value/)

    assert.throws(() => {
      api.dropsToAitd('.')
    }, /dropsToAitd: invalid value '\.', should be a BigNumber or string-encoded number\./)
  },
  'throws with an amount more than one decimal point': async (api) => {
    assert.throws(() => {
      api.dropsToAitd('1.0.0')
    }, /dropsToAitd: invalid value '1\.0\.0'/)

    assert.throws(() => {
      api.dropsToAitd('...')
    }, /dropsToAitd: invalid value '\.\.\.'/)
  }
}
