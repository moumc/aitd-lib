import {TestSuite, assertRejects, assertResultMatch} from '../../utils'
import requests from '../../fixtures/requests'
import responses from '../../fixtures/responses'
const instructionsWithMaxLedgerVersionOffset = {maxLedgerVersionOffset: 100}

/**
 * Every test suite exports their tests in the default object.
 * - Check out the "TestSuite" type for documentation on the interface.
 * - Check out "test/api/index.ts" for more information about the test runner.
 */
export default <TestSuite>{
  'prepareEscrowExecution': async (api, address) => {
    const result = await api.prepareEscrowExecution(
      address,
      requests.prepareEscrowExecution.normal,
      instructionsWithMaxLedgerVersionOffset
    )
    assertResultMatch(
      result,
      responses.prepareEscrowExecution.normal,
      'prepare'
    )
  },

  'prepareEscrowExecution - simple': async (api, address) => {
    const result = await api.prepareEscrowExecution(
      address,
      requests.prepareEscrowExecution.simple
    )
    assertResultMatch(
      result,
      responses.prepareEscrowExecution.simple,
      'prepare'
    )
  },

  'prepareEscrowExecution - no condition': async (api, address) => {
    await assertRejects(
      api.prepareEscrowExecution(
        address,
        requests.prepareEscrowExecution.noCondition,
        instructionsWithMaxLedgerVersionOffset
      ),
      api.errors.ValidationError,
      '"condition" and "fulfillment" fields on EscrowFinish must only be specified together.'
    )
  },

  'prepareEscrowExecution - no fulfillment': async (api, address) => {
    await assertRejects(
      api.prepareEscrowExecution(
        address,
        requests.prepareEscrowExecution.noFulfillment,
        instructionsWithMaxLedgerVersionOffset
      ),
      api.errors.ValidationError,
      '"condition" and "fulfillment" fields on EscrowFinish must only be specified together.'
    )
  },

  'with ticket': async (api, address) => {
    const localInstructions = {
      ...instructionsWithMaxLedgerVersionOffset,
      maxFee: '0.000396',
      ticketSequence: 23
    }
    const result = await api.prepareEscrowExecution(
      address,
      requests.prepareEscrowExecution.normal,
      localInstructions
    )
    assertResultMatch(
      result,
      responses.prepareEscrowExecution.ticket,
      'prepare'
    )
  }
}
