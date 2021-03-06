import * as utils from './utils'
import {validate, iso8601ToAitdTime, aitdToDrops} from '../common'
import {Instructions, Prepare, TransactionJSON} from './types'
import {AitdAPI} from '..'

export type PaymentChannelFund = {
  channel: string
  amount: string
  expiration?: string
}

function createPaymentChannelFundTransaction(
  account: string,
  fund: PaymentChannelFund
): TransactionJSON {
  const txJSON: TransactionJSON = {
    Account: account,
    TransactionType: 'PaymentChannelFund',
    Channel: fund.channel,
    Amount: aitdToDrops(fund.amount)
  }

  if (fund.expiration !== undefined) {
    txJSON.Expiration = iso8601ToAitdTime(fund.expiration)
  }

  return txJSON
}

function preparePaymentChannelFund(
  this: AitdAPI,
  address: string,
  paymentChannelFund: PaymentChannelFund,
  instructions: Instructions = {}
): Promise<Prepare> {
  try {
    validate.preparePaymentChannelFund({
      address,
      paymentChannelFund,
      instructions
    })
    const txJSON = createPaymentChannelFundTransaction(
      address,
      paymentChannelFund
    )
    return utils.prepareTransaction(txJSON, this, instructions)
  } catch (e) {
    return Promise.reject(e)
  }
}

export default preparePaymentChannelFund
