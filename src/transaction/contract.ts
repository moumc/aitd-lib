import * as _ from 'lodash'
import * as utils from './utils'
const validate = utils.common.validate
// const toAitddAmount = utils.common.toAitddAmount
// const paymentFlags = utils.common.txFlags.Payment
const ValidationError = utils.common.errors.ValidationError
import {Instructions, Prepare, TransactionJSON} from './types'
// import {
//     Amount,
//   Adjustment,
//   MaxAdjustment,
//   MinAdjustment,
//   // Memo
// } from '../common/types/objects'
// import {aitdToDrops} from '../common'
import {AitdAPI} from '..'
import {getClassicAccountAndTag, ClassicAccountAndTag} from './utils'

export interface Contract {
  source: string
  contractAddress: string
  // paths?: string
  contractData?: string
  fee: string
  amount: string
  // memos?: Array<Memo>
  // A 256-bit hash that can be used to identify a particular payment
  // invoiceID?: string
  // A boolean that, if set to true, indicates that this payment should go
  // through even if the whole amount cannot be delivered because of a lack of
  // liquidity or funds in the source_account account
  // allowPartialPayment?: boolean
  // A boolean that can be set to true if paths are specified and the sender
  // would like the Aitd Network to disregard any direct paths from
  // the source_account to the destination_account. This may be used to take
  // advantage of an arbitrage opportunity or by gateways wishing to issue
  // balances from a hot wallet to a user who has mistakenly set a trustline
  // directly to the hot wallet
  // noDirectAitd?: boolean
  // limitQuality?: boolean
}

// function isMaxAdjustment(
//   source: Adjustment | MaxAdjustment
// ): source is MaxAdjustment {
//   return (source as MaxAdjustment).maxAmount !== undefined
// }

// function isMinAdjustment(
//   destination: Adjustment | MinAdjustment
// ): destination is MinAdjustment {
//   return (destination as MinAdjustment).minAmount !== undefined
// }

// function isAITDToAITDPayment(payment: Payment): boolean {
//   const {source, destination} = payment
//   const sourceCurrency = isMaxAdjustment(source)
//     ? source.maxAmount.currency
//     : source.amount.currency
//   const destinationCurrency = isMinAdjustment(destination)
//     ? destination.minAmount.currency
//     : destination.amount.currency
//   return (
//     (sourceCurrency === 'AITD' || sourceCurrency === 'drops') &&
//     (destinationCurrency === 'AITD' || destinationCurrency === 'drops')
//   )
// }

// function isIOUWithoutCounterparty(amount: Amount): boolean {
//   return (
//     amount &&
//     amount.currency !== 'AITD' &&
//     amount.currency !== 'drops' &&
//     amount.counterparty === undefined
//   )
// }

// function applyAnyCounterpartyEncoding(payment: Payment): void {
//   // Convert blank counterparty to sender or receiver's address
//   //   (Aitd convention for 'any counterparty')
//   // https://developers.aitd.com/payment.html#special-issuer-values-for-sendmax-and-amount
//   _.forEach([payment.source, payment.destination], (adjustment) => {
//     _.forEach(['amount', 'minAmount', 'maxAmount'], (key) => {
//       if (isIOUWithoutCounterparty(adjustment[key])) {
//         adjustment[key].counterparty = adjustment.address
//       }
//     })
//   })
// }

// function createMaximalAmount(amount: Amount): Amount {
//   const maxAITDValue = '100000000000'

//   // Equivalent to '9999999999999999e80' but we cannot use that because sign()
//   // now checks that the encoded representation exactly matches the transaction
//   // as it was originally provided.
//   const maxIOUValue =
//     '999999999999999900000000000000000000000000000000000000000000000000000000000000000000000000000000'

//   let maxValue
//   if (amount.currency === 'AITD') {
//     maxValue = maxAITDValue
//   } else if (amount.currency === 'drops') {
//     maxValue = aitdToDrops(maxAITDValue)
//   } else {
//     maxValue = maxIOUValue
//   }
//   return _.assign({}, amount, {value: maxValue})
// }

/**
 * Given an address and tag:
 * 1. Get the classic account and tag;
 * 2. If a tag is provided:
 *    2a. If the address was an X-address, validate that the X-address has the expected tag;
 *    2b. If the address was a classic address, return `expectedTag` as the tag.
 * 3. If we do not want to use a tag in this case,
 *    set the tag in the return value to `undefined`.
 *
 * @param address The address to parse.
 * @param expectedTag If provided, and the `Account` is an X-address,
 *                    this method throws an error if `expectedTag`
 *                    does not match the tag of the X-address.
 * @returns {ClassicAccountAndTag}
 *          The classic account and tag.
 */
function validateAndNormalizeAddress(
  address: string,
  expectedTag: number | undefined
): ClassicAccountAndTag {
  const classicAddress = getClassicAccountAndTag(address, expectedTag)
  classicAddress.tag =
    classicAddress.tag === false ? undefined : classicAddress.tag
  return classicAddress
}

function createPaymentTransaction(
  address: string,
  contractArgument: Contract
): TransactionJSON {
  const contract = _.cloneDeep(contractArgument);
  const sourceAddressAndTag = validateAndNormalizeAddress(contract.source, undefined);
  const addressToVerifyAgainst = validateAndNormalizeAddress(address, undefined);
  if (addressToVerifyAgainst.classicAccount !== sourceAddressAndTag.classicAccount) {
      throw new ValidationError('address must match contract.source');
  }

  const destinationAddressAndTag = validateAndNormalizeAddress(contract.contractAddress, undefined);

  var HEX_REGEX = /^[a-fA-F0-9]$/;
  function isHex(val) {
      return HEX_REGEX.test(val);
  }

  for (let i of contract.contractData) {
      if (!isHex(i)) {
          throw new ValidationError('contract data must be hex');
      }
  }

  const txJSON = {
      TransactionType: 'Contract',
      Account: sourceAddressAndTag.classicAccount,
      ContractAddress: destinationAddressAndTag.classicAccount,
      ContractData: contract.contractData.toUpperCase(),
      Fee: contract.fee,
      Flags: 0,
      Amount: contract.amount
  };

  // const contract = _.cloneDeep(contractArgument)
  // applyAnyCounterpartyEncoding(contract)

  // const sourceAddressAndTag = validateAndNormalizeAddress(
  //   contract.source.address,
  //   contract.source.tag
  // )
  // const addressToVerifyAgainst = validateAndNormalizeAddress(address, undefined)

  // if (
  //   addressToVerifyAgainst.classicAccount !== sourceAddressAndTag.classicAccount
  // ) {
  //   throw new ValidationError('address must match payment.source.address')
  // }

  // if (
  //   addressToVerifyAgainst.tag !== undefined &&
  //   sourceAddressAndTag.tag !== undefined &&
  //   addressToVerifyAgainst.tag !== sourceAddressAndTag.tag
  // ) {
  //   throw new ValidationError(
  //     'address includes a tag that does not match payment.source.tag'
  //   )
  // }

  // const destinationAddressAndTag = validateAndNormalizeAddress(
  //   payment.destination.address,
  //   payment.destination.tag
  // )

  // if (
  //   (isMaxAdjustment(payment.source) && isMinAdjustment(payment.destination)) ||
  //   (!isMaxAdjustment(payment.source) && !isMinAdjustment(payment.destination))
  // ) {
  //   throw new ValidationError(
  //     'payment must specify either (source.maxAmount ' +
  //       'and destination.amount) or (source.amount and destination.minAmount)'
  //   )
  // }

  // const destinationAmount = isMinAdjustment(payment.destination)
  //   ? payment.destination.minAmount
  //   : payment.destination.amount
  // const sourceAmount = isMaxAdjustment(payment.source)
  //   ? payment.source.maxAmount
  //   : payment.source.amount

  // // when using destination.minAmount, aitdd still requires that we set
  // // a destination amount in addition to DeliverMin. the destination amount
  // // is interpreted as the maximum amount to send. we want to be sure to
  // // send the whole source amount, so we set the destination amount to the
  // // maximum possible amount. otherwise it's possible that the destination
  // // cap could be hit before the source cap.
  // const amount =
  //   isMinAdjustment(payment.destination) && !isAITDToAITDPayment(payment)
  //     ? createMaximalAmount(destinationAmount)
  //     : destinationAmount

  // const txJSON: any = {
  //   TransactionType: 'Payment',
  //   Account: sourceAddressAndTag.classicAccount,
  //   Destination: destinationAddressAndTag.classicAccount,
  //   Amount: toAitddAmount(amount),
  //   Flags: 0
  // }

  // if (payment.invoiceID !== undefined) {
  //   txJSON.InvoiceID = payment.invoiceID
  // }
  // if (sourceAddressAndTag.tag !== undefined) {
  //   txJSON.SourceTag = sourceAddressAndTag.tag
  // }
  // if (destinationAddressAndTag.tag !== undefined) {
  //   txJSON.DestinationTag = destinationAddressAndTag.tag
  // }
  // if (payment.memos !== undefined) {
  //   txJSON.Memos = _.map(payment.memos, utils.convertMemo)
  // }
  // if (payment.noDirectAitd === true) {
  //   txJSON.Flags |= paymentFlags.NoAitdDirect
  // }
  // if (payment.limitQuality === true) {
  //   txJSON.Flags |= paymentFlags.LimitQuality
  // }
  // if (!isAITDToAITDPayment(payment)) {
  //   // Don't set SendMax for AITD->AITD payment
  //   // temREDUNDANT_SEND_MAX removed in:
  //   // https://github.com/aitd/aitdd/commit/
  //   //  c522ffa6db2648f1d8a987843e7feabf1a0b7de8/
  //   if (payment.allowPartialPayment || isMinAdjustment(payment.destination)) {
  //     txJSON.Flags |= paymentFlags.PartialPayment
  //   }

  //   txJSON.SendMax = toAitddAmount(sourceAmount)

  //   if (isMinAdjustment(payment.destination)) {
  //     txJSON.DeliverMin = toAitddAmount(destinationAmount)
  //   }

  //   if (payment.paths !== undefined) {
  //     txJSON.Paths = JSON.parse(payment.paths)
  //   }
  // } else if (payment.allowPartialPayment === true) {
  //   throw new ValidationError('AITD to AITD payments cannot be partial payments')
  // }

  return txJSON
}

function prepareContract(
  this: AitdAPI,
  address: string,
  contract: Contract,
  instructions: Instructions = {}
): Promise<Prepare> {
  try {
    validate.prepareContract({address, contract, instructions})
    const txJSON = createPaymentTransaction(address, contract)
    return utils.prepareTransaction(txJSON, this, instructions)
  } catch (e) {
    return Promise.reject(e)
  }
}

export default prepareContract
