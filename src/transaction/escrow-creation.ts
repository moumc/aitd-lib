import * as utils from './utils'
import {validate, iso8601ToAitdTime, aitdToDrops} from '../common'
const ValidationError = utils.common.errors.ValidationError
import {Instructions, Prepare, TransactionJSON} from './types'
import {Memo} from '../common/types/objects'
import {AitdAPI} from '..'

export type EscrowCreation = {
  amount: string
  destination: string
  memos?: Array<Memo>
  condition?: string
  allowCancelAfter?: string
  allowExecuteAfter?: string
  sourceTag?: number
  destinationTag?: number
}

function createEscrowCreationTransaction(
  account: string,
  payment: EscrowCreation
): TransactionJSON {
  const txJSON: any = {
    TransactionType: 'EscrowCreate',
    Account: account,
    Destination: payment.destination,
    Amount: aitdToDrops(payment.amount)
  }

  if (payment.condition !== undefined) {
    txJSON.Condition = payment.condition
  }
  if (payment.allowCancelAfter !== undefined) {
    txJSON.CancelAfter = iso8601ToAitdTime(payment.allowCancelAfter)
  }
  if (payment.allowExecuteAfter !== undefined) {
    txJSON.FinishAfter = iso8601ToAitdTime(payment.allowExecuteAfter)
  }
  if (payment.sourceTag !== undefined) {
    txJSON.SourceTag = payment.sourceTag
  }
  if (payment.destinationTag !== undefined) {
    txJSON.DestinationTag = payment.destinationTag
  }
  if (payment.memos !== undefined) {
    txJSON.Memos = payment.memos.map(utils.convertMemo)
  }
  if (
    Boolean(payment.allowCancelAfter) &&
    Boolean(payment.allowExecuteAfter) &&
    txJSON.CancelAfter <= txJSON.FinishAfter
  ) {
    throw new ValidationError(
      'prepareEscrowCreation: ' +
        '"allowCancelAfter" must be after "allowExecuteAfter"'
    )
  }
  return txJSON
}

function prepareEscrowCreation(
  this: AitdAPI,
  address: string,
  escrowCreation: EscrowCreation,
  instructions: Instructions = {}
): Promise<Prepare> {
  try {
    validate.prepareEscrowCreation({address, escrowCreation, instructions})
    const txJSON = createEscrowCreationTransaction(address, escrowCreation)
    return utils.prepareTransaction(txJSON, this, instructions)
  } catch (e) {
    return Promise.reject(e)
  }
}

export default prepareEscrowCreation
