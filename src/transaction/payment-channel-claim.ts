import * as utils from './utils'
const ValidationError = utils.common.errors.ValidationError
const claimFlags = utils.common.txFlags.PaymentChannelClaim
import {validate, aitdToDrops} from '../common'
import {Instructions, Prepare, TransactionJSON} from './types'
import {AitdAPI} from '..'

export type PaymentChannelClaim = {
  channel: string
  balance?: string
  amount?: string
  signature?: string
  publicKey?: string
  renew?: boolean
  close?: boolean
}

function createPaymentChannelClaimTransaction(
  account: string,
  claim: PaymentChannelClaim
): TransactionJSON {
  const txJSON: TransactionJSON = {
    Account: account,
    TransactionType: 'PaymentChannelClaim',
    Channel: claim.channel,
    Flags: 0
  }

  if (claim.balance !== undefined) {
    txJSON.Balance = aitdToDrops(claim.balance)
  }
  if (claim.amount !== undefined) {
    txJSON.Amount = aitdToDrops(claim.amount)
  }

  if (Boolean(claim.signature) !== Boolean(claim.publicKey)) {
    throw new ValidationError(
      '"signature" and "publicKey" fields on' +
        ' PaymentChannelClaim must only be specified together.'
    )
  }

  if (claim.signature !== undefined) {
    txJSON.Signature = claim.signature
  }
  if (claim.publicKey !== undefined) {
    txJSON.PublicKey = claim.publicKey
  }

  if (claim.renew === true && claim.close === true) {
    throw new ValidationError(
      '"renew" and "close" flags on PaymentChannelClaim' +
        ' are mutually exclusive'
    )
  }

  if (claim.renew === true) {
    txJSON.Flags |= claimFlags.Renew
  }
  if (claim.close === true) {
    txJSON.Flags |= claimFlags.Close
  }

  return txJSON
}

function preparePaymentChannelClaim(
  this: AitdAPI,
  address: string,
  paymentChannelClaim: PaymentChannelClaim,
  instructions: Instructions = {}
): Promise<Prepare> {
  try {
    validate.preparePaymentChannelClaim({
      address,
      paymentChannelClaim,
      instructions
    })
    const txJSON = createPaymentChannelClaimTransaction(
      address,
      paymentChannelClaim
    )
    return utils.prepareTransaction(txJSON, this, instructions)
  } catch (e) {
    return Promise.reject(e)
  }
}

export default preparePaymentChannelClaim
