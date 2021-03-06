import BigNumber from 'bignumber.js'
import {dropsToAitd} from '../../common'

function parseFeeUpdate(tx: any) {
  const baseFeeDrops = new BigNumber(tx.BaseFee, 16).toString()
  return {
    baseFeeAITD: dropsToAitd(baseFeeDrops),
    referenceFeeUnits: tx.ReferenceFeeUnits,
    reserveBaseAITD: dropsToAitd(tx.ReserveBase),
    reserveIncrementAITD: dropsToAitd(tx.ReserveIncrement)
  }
}

export default parseFeeUpdate
