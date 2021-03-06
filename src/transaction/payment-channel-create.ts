import * as utils from './utils'
import {validate, iso8601ToAitdTime, aitdToDrops} from '../common'
import {Instructions, Prepare, TransactionJSON} from './types'
import {AitdAPI} from '..'

export type PaymentChannelCreate = {
  amount: string
  destination: string
  settleDelay: number
  publicKey: string
  cancelAfter?: string
  sourceTag?: number
  destinationTag?: number
}

function createPaymentChannelCreateTransaction(
  account: string,
  paymentChannel: PaymentChannelCreate
): TransactionJSON {
  const txJSON: any = {
    Account: account,
    TransactionType: 'PaymentChannelCreate',
    Amount: aitdToDrops(paymentChannel.amount),
    Destination: paymentChannel.destination,
    SettleDelay: paymentChannel.settleDelay,
    PublicKey: paymentChannel.publicKey.toUpperCase()
  }

  if (paymentChannel.cancelAfter !== undefined) {
    txJSON.CancelAfter = iso8601ToAitdTime(paymentChannel.cancelAfter)
  }
  if (paymentChannel.sourceTag !== undefined) {
    txJSON.SourceTag = paymentChannel.sourceTag
  }
  if (paymentChannel.destinationTag !== undefined) {
    txJSON.DestinationTag = paymentChannel.destinationTag
  }

  return txJSON
}

function preparePaymentChannelCreate(
  this: AitdAPI,
  address: string,
  paymentChannelCreate: PaymentChannelCreate,
  instructions: Instructions = {}
): Promise<Prepare> {
  try {
    validate.preparePaymentChannelCreate({
      address,
      paymentChannelCreate,
      instructions
    })
    const txJSON = createPaymentChannelCreateTransaction(
      address,
      paymentChannelCreate
    )
    return utils.prepareTransaction(txJSON, this, instructions)
  } catch (e) {
    return Promise.reject(e)
  }
}

export default preparePaymentChannelCreate
