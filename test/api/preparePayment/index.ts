import {assertResultMatch, TestSuite, assertRejects} from '../../utils'
import responses from '../../fixtures/responses'
import requests from '../../fixtures/requests'
import {ValidationError} from 'aitd-api/common/errors'
import binary from 'aitd-binary-codec'
import assert from 'assert-diff'
import {AitdAPI} from 'aitd-api'

const {schemaValidator} = AitdAPI._PRIVATE
const instructionsWithMaxLedgerVersionOffset = {maxLedgerVersionOffset: 100}
const {preparePayment: REQUEST_FIXTURES} = requests
const {preparePayment: RESPONSE_FIXTURES} = responses
const RECIPIENT_ADDRESS = 'rpZc4mVfWUif9CRoHRKKcmhu1nx2xktxBo'

/**
 * Every test suite exports their tests in the default object.
 * - Check out the "TestSuite" type for documentation on the interface.
 * - Check out "test/api/index.ts" for more information about the test runner.
 */
export default <TestSuite>{
  'normal': async (api, address) => {
    const localInstructions = {
      ...instructionsWithMaxLedgerVersionOffset,
      maxFee: '0.000012'
    }
    const response = await api.preparePayment(
      address,
      REQUEST_FIXTURES.normal,
      localInstructions
    )
    assertResultMatch(response, RESPONSE_FIXTURES.normal, 'prepare')
  },

  'min amount aitd': async (api, address) => {
    const localInstructions = {
      ...instructionsWithMaxLedgerVersionOffset,
      maxFee: '0.000012'
    }
    const response = await api.preparePayment(
      address,
      REQUEST_FIXTURES.minAmountAITD,
      localInstructions
    )
    assertResultMatch(response, RESPONSE_FIXTURES.minAmountAITD, 'prepare')
  },

  'min amount aitd2aitd': async (api, address) => {
    const response = await api.preparePayment(
      address,
      REQUEST_FIXTURES.minAmount,
      instructionsWithMaxLedgerVersionOffset
    )
    assertResultMatch(response, RESPONSE_FIXTURES.minAmountAITDAITD, 'prepare')
  },

  'AITD to AITD': async (api, address) => {
    const payment = {
      source: {
        address: 'r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59',
        maxAmount: {value: '1', currency: 'AITD'}
      },
      destination: {
        address: 'rpZc4mVfWUif9CRoHRKKcmhu1nx2xktxBo',
        amount: {value: '1', currency: 'AITD'}
      }
    }
    const expected = {
      txJSON:
        '{"TransactionType":"Payment","Account":"r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59","Destination":"rpZc4mVfWUif9CRoHRKKcmhu1nx2xktxBo","Amount":"1000000","Flags":2147483648,"LastLedgerSequence":8820051,"Sequence":23,"Fee":"12"}',
      instructions: {
        fee: '0.000012',
        sequence: 23,
        maxLedgerVersion: 8820051
      }
    }
    const response = await api.preparePayment(
      address,
      payment,
      instructionsWithMaxLedgerVersionOffset
    )
    assertResultMatch(response, expected, 'prepare')
  },

  'AITD drops to AITD drops': async (api, address) => {
    const payment = {
      source: {
        address: 'r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59',
        maxAmount: {value: '1000000', currency: 'drops'}
      },
      destination: {
        address: 'rpZc4mVfWUif9CRoHRKKcmhu1nx2xktxBo',
        amount: {value: '1000000', currency: 'drops'}
      }
    }
    const expected = {
      txJSON:
        '{"TransactionType":"Payment","Account":"r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59","Destination":"rpZc4mVfWUif9CRoHRKKcmhu1nx2xktxBo","Amount":"1000000","Flags":2147483648,"LastLedgerSequence":8820051,"Sequence":23,"Fee":"12"}',
      instructions: {
        fee: '0.000012',
        sequence: 23,
        maxLedgerVersion: 8820051
      }
    }
    const response = await api.preparePayment(
      address,
      payment,
      instructionsWithMaxLedgerVersionOffset
    )
    assertResultMatch(response, expected, 'prepare')
  },

  'AITD drops to AITD': async (api, address) => {
    const payment = {
      source: {
        address: 'r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59',
        maxAmount: {value: '1000000', currency: 'drops'}
      },
      destination: {
        address: 'rpZc4mVfWUif9CRoHRKKcmhu1nx2xktxBo',
        amount: {value: '1', currency: 'AITD'}
      }
    }
    const expected = {
      txJSON:
        '{"TransactionType":"Payment","Account":"r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59","Destination":"rpZc4mVfWUif9CRoHRKKcmhu1nx2xktxBo","Amount":"1000000","Flags":2147483648,"LastLedgerSequence":8820051,"Sequence":23,"Fee":"12"}',
      instructions: {
        fee: '0.000012',
        sequence: 23,
        maxLedgerVersion: 8820051
      }
    }
    const response = await api.preparePayment(
      address,
      payment,
      instructionsWithMaxLedgerVersionOffset
    )
    assertResultMatch(response, expected, 'prepare')
  },

  'AITD to AITD drops': async (api, address) => {
    const payment = {
      source: {
        address: 'r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59',
        maxAmount: {value: '1', currency: 'AITD'}
      },
      destination: {
        address: 'rpZc4mVfWUif9CRoHRKKcmhu1nx2xktxBo',
        amount: {value: '1000000', currency: 'drops'}
      }
    }
    const expected = {
      txJSON:
        '{"TransactionType":"Payment","Account":"r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59","Destination":"rpZc4mVfWUif9CRoHRKKcmhu1nx2xktxBo","Amount":"1000000","Flags":2147483648,"LastLedgerSequence":8820051,"Sequence":23,"Fee":"12"}',
      instructions: {
        fee: '0.000012',
        sequence: 23,
        maxLedgerVersion: 8820051
      }
    }
    const response = await api.preparePayment(
      address,
      payment,
      instructionsWithMaxLedgerVersionOffset
    )
    assertResultMatch(response, expected, 'prepare')
  },

  // Errors
  'rejects promise and does not throw when payment object is invalid': async (
    api,
    address
  ) => {
    const payment = {
      source: {
        address: address,
        // instead of `maxAmount`
        amount: {value: '1000', currency: 'drops'}
      },
      destination: {
        address: RECIPIENT_ADDRESS,
        amount: {value: '1000', currency: 'drops'}
      }
    }

    return assertRejects(
      api.preparePayment(address, payment),
      ValidationError,
      'payment must specify either (source.maxAmount and destination.amount) or (source.amount and destination.minAmount)'
    )
  },

  'rejects promise and does not throw when field is missing': async (
    api,
    address
  ) => {
    // Marking as "any" to get around the fact that TS won't allow this.
    const payment: any = {
      source: {address: address},
      destination: {
        address: RECIPIENT_ADDRESS,
        amount: {value: '1000', currency: 'drops'}
      }
    }

    return assertRejects(
      api.preparePayment(address, payment),
      ValidationError,
      'instance.payment.source is not exactly one from <sourceExactAdjustment>,<maxAdjustment>'
    )
  },

  'rejects promise and does not throw when fee exceeds maxFeeAITD': async (
    api,
    address
  ) => {
    const payment = {
      source: {
        address: address,
        maxAmount: {value: '1000', currency: 'drops'}
      },
      destination: {
        address: RECIPIENT_ADDRESS,
        amount: {value: '1000', currency: 'drops'}
      }
    }
    return assertRejects(
      api.preparePayment(address, payment, {fee: '3'}),
      ValidationError,
      'Fee of 3 AITD exceeds max of 2 AITD. To use this fee, increase `maxFeeAITD` in the AitdAPI constructor.'
    )
  },

  'AITD to AITD no partial': async (api, address) => {
    return assertRejects(
      api.preparePayment(address, REQUEST_FIXTURES.wrongPartial),
      ValidationError,
      'AITD to AITD payments cannot be partial payments'
    )
  },

  'address must match payment.source.address': async (api, address) => {
    return assertRejects(
      api.preparePayment(address, REQUEST_FIXTURES.wrongAddress),
      ValidationError,
      'address must match payment.source.address'
    )
  },

  'wrong amount': async (api, address) => {
    return assertRejects(
      api.preparePayment(address, REQUEST_FIXTURES.wrongAmount),
      ValidationError,
      'payment must specify either (source.maxAmount and destination.amount) or (source.amount and destination.minAmount)'
    )
  },

  'throws when fee exceeds 2 AITD': async (api, address) => {
    const localInstructions = {
      ...instructionsWithMaxLedgerVersionOffset,
      fee: '2.1'
    }
    return assertRejects(
      api.preparePayment(address, REQUEST_FIXTURES.normal, localInstructions),
      ValidationError,
      'Fee of 2.1 AITD exceeds max of 2 AITD. To use this fee, increase `maxFeeAITD` in the AitdAPI constructor.'
    )
  },

  'preparePayment with all options specified': async (api, address) => {
    const version = await api.getLedgerVersion()
    const localInstructions = {
      maxLedgerVersion: version + 100,
      fee: '0.000012'
    }
    const response = await api.preparePayment(
      address,
      REQUEST_FIXTURES.allOptions,
      localInstructions
    )
    assertResultMatch(response, RESPONSE_FIXTURES.allOptions, 'prepare')
  },

  'preparePayment without counterparty set': async (api, address) => {
    const localInstructions = {
      ...instructionsWithMaxLedgerVersionOffset,
      sequence: 23
    }
    const response = await api.preparePayment(
      address,
      REQUEST_FIXTURES.noCounterparty,
      localInstructions
    )
    assertResultMatch(response, RESPONSE_FIXTURES.noCounterparty, 'prepare')
  },

  'preparePayment with source.amount/destination.minAmount can be signed': async (
    api,
    address
  ) => {
    // See also: 'sign succeeds with source.amount/destination.minAmount'

    const localInstructions = {
      ...instructionsWithMaxLedgerVersionOffset,
      sequence: 23
    }
    const response = await api.preparePayment(
      address,
      {
        source: {
          address,
          amount: {
            currency: 'GBP',
            value: '0.1',
            counterparty: 'rpat5TmYjDsnFSStmgTumFgXCM9eqsWPro'
          }
        },
        destination: {
          address: 'rEX4LtGJubaUcMWCJULcy4NVxGT9ZEMVRq',
          minAmount: {
            currency: 'USD',
            value: '0.1248548562296331',
            counterparty: 'rMaa8VLBTjwTJWA2kSme4Sqgphhr6Lr6FH'
          }
        }
      },
      localInstructions
    )

    // Important: check that the prepared transaction can actually be signed
    // https://github.com/aitd/aitd-lib/issues/1237#issuecomment-631670946

    const secret = 'shotKgaEotpcYsshSE39vmSnBDRim'
    const result = api.sign(response.txJSON, secret)
    const expectedResult = {
      signedTransaction:
        '12000022800200002400000017201B0086955361EC6386F26FC0FFFF0000000000000000000000005553440000000000DC596C88BCDE4E818D416FCDEEBF2C8656BADC9A68400000000000000C69D4438D7EA4C6800000000000000000000000000047425000000000000C155FFE99C8C91F67083CEFFDB69EBFE76348CA6AD4446F8C5D8A5E0B0000000000000000000000005553440000000000DC596C88BCDE4E818D416FCDEEBF2C8656BADC9A7321022B05847086686F9D0499B13136B94AD4323EE1B67D4C429ECC987AB35ACFA34574473045022100D9634523D8E232D4A7807A71856023D82AC928FA29848571B820867898413B5F022041AC00EC1F81A26A6504EBF844A38CC3204694EF2CC1A97A87632721631F93DA81145E7B112523F68D2F5E879DB4EAC51C6698A6930483149F500E50C2F016CA01945E5A1E5846B61EF2D376',
      id: '1C558AA9B926C24FB6BBD6950B2DB1350A83F9F12E4385208867907019761A2D'
    }
    const decoded = binary.decode(result.signedTransaction)
    assert(
      decoded.Flags === 2147614720,
      `Flags = ${decoded.Flags}, should be 2147614720`
    )
    assert.deepEqual(result, expectedResult)
    schemaValidator.schemaValidate('sign', result)
  },

  'destination.minAmount': async (api, address) => {
    const response = await api.preparePayment(
      address,
      responses.getPaths.sendAll[0],
      instructionsWithMaxLedgerVersionOffset
    )
    assertResultMatch(response, RESPONSE_FIXTURES.minAmount, 'prepare')
  },

  'caps fee at 2 AITD by default': async (api, address) => {
    api._feeCushion = 1000000
    const expectedResponse = {
      txJSON:
        '{"Flags":2147483648,"TransactionType":"Payment","Account":"r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59","Destination":"rpZc4mVfWUif9CRoHRKKcmhu1nx2xktxBo","Amount":{"value":"0.01","currency":"USD","issuer":"rMH4UxPrbuMa1spCBR98hLLyNJp4d8p4tM"},"SendMax":{"value":"0.01","currency":"USD","issuer":"rMH4UxPrbuMa1spCBR98hLLyNJp4d8p4tM"},"LastLedgerSequence":8820051,"Fee":"2000000","Sequence":23}',
      instructions: {
        fee: '2',
        sequence: 23,
        maxLedgerVersion: 8820051
      }
    }
    const response = await api.preparePayment(
      address,
      REQUEST_FIXTURES.normal,
      instructionsWithMaxLedgerVersionOffset
    )
    assertResultMatch(response, expectedResponse, 'prepare')
  },

  'allows fee exceeding 2 AITD when maxFeeAITD is higher': async (
    api,
    address
  ) => {
    api._maxFeeAITD = '2.2'
    const localInstructions = {
      ...instructionsWithMaxLedgerVersionOffset,
      fee: '2.1'
    }
    const expectedResponse = {
      txJSON:
        '{"Flags":2147483648,"TransactionType":"Payment","Account":"r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59","Destination":"rpZc4mVfWUif9CRoHRKKcmhu1nx2xktxBo","Amount":{"value":"0.01","currency":"USD","issuer":"rMH4UxPrbuMa1spCBR98hLLyNJp4d8p4tM"},"SendMax":{"value":"0.01","currency":"USD","issuer":"rMH4UxPrbuMa1spCBR98hLLyNJp4d8p4tM"},"LastLedgerSequence":8820051,"Fee":"2100000","Sequence":23}',
      instructions: {
        fee: '2.1',
        sequence: 23,
        maxLedgerVersion: 8820051
      }
    }
    const response = await api.preparePayment(
      address,
      REQUEST_FIXTURES.normal,
      localInstructions
    )
    assertResultMatch(response, expectedResponse, 'prepare')
  },

  'fee - default maxFee of 2 AITD': async (api, address) => {
    api._feeCushion = 1000000
    const expectedResponse = {
      txJSON:
        '{"Flags":2147483648,"TransactionType":"Payment","Account":"r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59","Destination":"rpZc4mVfWUif9CRoHRKKcmhu1nx2xktxBo","Amount":{"value":"0.01","currency":"USD","issuer":"rMH4UxPrbuMa1spCBR98hLLyNJp4d8p4tM"},"SendMax":{"value":"0.01","currency":"USD","issuer":"rMH4UxPrbuMa1spCBR98hLLyNJp4d8p4tM"},"LastLedgerSequence":8820051,"Fee":"2000000","Sequence":23}',
      instructions: {
        fee: '2',
        sequence: 23,
        maxLedgerVersion: 8820051
      }
    }
    const response = await api.preparePayment(
      address,
      requests.preparePayment.normal,
      instructionsWithMaxLedgerVersionOffset
    )
    assertResultMatch(response, expectedResponse, 'prepare')
  },

  'fee - capped to maxFeeAITD when maxFee exceeds maxFeeAITD': async (
    api,
    address
  ) => {
    api._feeCushion = 1000000
    api._maxFeeAITD = '3'
    const localInstructions = {
      ...instructionsWithMaxLedgerVersionOffset,
      maxFee: '4'
    }
    const expectedResponse = {
      txJSON:
        '{"Flags":2147483648,"TransactionType":"Payment","Account":"r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59","Destination":"rpZc4mVfWUif9CRoHRKKcmhu1nx2xktxBo","Amount":{"value":"0.01","currency":"USD","issuer":"rMH4UxPrbuMa1spCBR98hLLyNJp4d8p4tM"},"SendMax":{"value":"0.01","currency":"USD","issuer":"rMH4UxPrbuMa1spCBR98hLLyNJp4d8p4tM"},"LastLedgerSequence":8820051,"Fee":"3000000","Sequence":23}',
      instructions: {
        fee: '3',
        sequence: 23,
        maxLedgerVersion: 8820051
      }
    }
    const response = await api.preparePayment(
      address,
      requests.preparePayment.normal,
      localInstructions
    )
    assertResultMatch(response, expectedResponse, 'prepare')
  },

  'fee - capped to maxFee': async (api, address) => {
    api._feeCushion = 1000000
    api._maxFeeAITD = '5'
    const localInstructions = {
      ...instructionsWithMaxLedgerVersionOffset,
      maxFee: '4'
    }
    const expectedResponse = {
      txJSON:
        '{"Flags":2147483648,"TransactionType":"Payment","Account":"r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59","Destination":"rpZc4mVfWUif9CRoHRKKcmhu1nx2xktxBo","Amount":{"value":"0.01","currency":"USD","issuer":"rMH4UxPrbuMa1spCBR98hLLyNJp4d8p4tM"},"SendMax":{"value":"0.01","currency":"USD","issuer":"rMH4UxPrbuMa1spCBR98hLLyNJp4d8p4tM"},"LastLedgerSequence":8820051,"Fee":"4000000","Sequence":23}',
      instructions: {
        fee: '4',
        sequence: 23,
        maxLedgerVersion: 8820051
      }
    }
    const response = await api.preparePayment(
      address,
      requests.preparePayment.normal,
      localInstructions
    )
    assertResultMatch(response, expectedResponse, 'prepare')
  },

  'fee - calculated fee does not use more than 6 decimal places': async (
    api,
    address
  ) => {
    api.connection.request({
      command: 'config',
      data: {loadFactor: 5407.96875}
    })
    const expectedResponse = {
      txJSON:
        '{"Flags":2147483648,"TransactionType":"Payment","Account":"r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59","Destination":"rpZc4mVfWUif9CRoHRKKcmhu1nx2xktxBo","Amount":{"value":"0.01","currency":"USD","issuer":"rMH4UxPrbuMa1spCBR98hLLyNJp4d8p4tM"},"SendMax":{"value":"0.01","currency":"USD","issuer":"rMH4UxPrbuMa1spCBR98hLLyNJp4d8p4tM"},"LastLedgerSequence":8820051,"Fee":"64896","Sequence":23}',
      instructions: {
        fee: '0.064896',
        sequence: 23,
        maxLedgerVersion: 8820051
      }
    }
    const response = await api.preparePayment(
      address,
      requests.preparePayment.normal,
      instructionsWithMaxLedgerVersionOffset
    )
    assertResultMatch(response, expectedResponse, 'prepare')
  },

  // Tickets
  'preparePayment with ticketSequence': async (api, address) => {
    const version = await api.getLedgerVersion()
    const localInstructions = {
      maxLedgerVersion: version + 100,
      fee: '0.000012',
      ticketSequence: 23
    }
    const response = await api.preparePayment(
      address,
      REQUEST_FIXTURES.allOptions,
      localInstructions
    )
    assertResultMatch(response, RESPONSE_FIXTURES.ticketSequence, 'prepare')
  },

  'throws when both sequence and ticketSequence are set': async (
    api,
    address
  ) => {
    const version = await api.getLedgerVersion()
    const localInstructions = {
      maxLedgerVersion: version + 100,
      fee: '0.000012',
      ticketSequence: 23,
      sequence: 12
    }
    return assertRejects(
      api.preparePayment(
        address,
        REQUEST_FIXTURES.allOptions,
        localInstructions
      ),
      ValidationError,
      'instance.instructions is of prohibited type [object Object]'
    )
  }
}
