import setupAPI from './setup-api'
import {RippleAPI} from 'ripple-api'
import addresses from './fixtures/addresses.json'
import {getAllPublicMethods, loadTestSuites} from './utils'

/**
 * RippleAPI Test Runner
 *
 * Background: "test/api-test.ts" had hit 4000+ lines of test code and 300+
 * individual tests. Additionally, a new address format was added which
 * forced us to copy-paste duplicate the test file to test both the old forms
 * of address. This added a significant maintenance burden.
 *
 * This test runner allows us to split our tests by RippleAPI method, and
 * automatically load, validate, and run them. Each tests accepts arguments to
 * test with, which allows us to re-run tests across different data
 * (ex: different address styles).
 *
 * Additional benefits:
 *   - Throw errors when we detect the absence of tests.
 *   - Type the API object under test and catch typing issues (currently untyped).
 *   - Sets the stage for more cleanup, like moving test-specific fixtures closer to their tests.
 */
describe('RippleAPI [Test Runner]', function () {
  beforeEach(setupAPI.setup)
  afterEach(setupAPI.teardown)

  // Collect all the tests:
  const allPublicMethods = getAllPublicMethods(new RippleAPI())
  const allTestSuites = loadTestSuites()

  // Run all the tests:
  for (const {name: methodName, tests, config} of allTestSuites) {
    describe(`api.${methodName}`, () => {
      // Run each test that does not use an address.
      for (const [testName, fn] of tests) {
        if (fn.length === 1) {
          it(testName, function () {
            return fn(this.api, addresses.ACCOUNT)
          })
        }
      }
      // Run each test with a classic address.
      describe(`[Classic Address]`, () => {
        for (const [testName, fn] of tests) {
          if (fn.length === 2) {
            it(testName, function () {
              return fn(this.api, addresses.ACCOUNT)
            })
          }
        }
      })
      // Run each test with an X-address.
      if (!config.skipXAddress) {
        describe(`[X-address]`, () => {
          for (const [testName, fn] of tests) {
            if (fn.length === 2) {
              it(testName, function () {
                return fn(this.api, addresses.ACCOUNT_X)
              })
            }
          }
        })
      }
    })
  }

  // Report any missing tests.
  const allTestedMethods = new Set(allTestSuites.map((s) => s.name))
  for (const methodName of allPublicMethods) {
    if (!allTestedMethods.has(methodName)) {
      // TODO: Once migration is complete, remove `.skip()` so that missing tests are reported as failures.
      it.skip(`${methodName} - no test suite found`, () => {
        throw new Error(
          `Test file not found! Create file "test/api/${methodName}/index.ts".`
        )
      })
    }
  }
})
