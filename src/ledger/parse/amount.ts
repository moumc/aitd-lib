import * as common from '../../common'
import {Amount, AitddAmount} from '../../common/types/objects'

function parseAmount(amount: AitddAmount): Amount {
  if (typeof amount === 'string') {
    return {
      currency: 'AITD',
      value: common.dropsToAitd(amount)
    }
  }
  return {
    currency: amount.currency,
    value: amount.value,
    counterparty: amount.issuer
  }
}

export default parseAmount
