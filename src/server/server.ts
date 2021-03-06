import * as common from '../common'
import {AitdAPI} from '..'

function isConnected(this: AitdAPI): boolean {
  return this.connection.isConnected()
}

function getLedgerVersion(this: AitdAPI): Promise<number> {
  return this.connection.getLedgerVersion()
}

async function connect(this: AitdAPI): Promise<void> {
  return this.connection.connect()
}

async function disconnect(this: AitdAPI): Promise<void> {
  // backwards compatibility: connection.disconnect() can return a number, but
  // this method returns nothing. SO we await but don't return any result.
  await this.connection.disconnect()
}

function formatLedgerClose(ledgerClose: any): object {
  return {
    baseFeeAITD: common.dropsToAitd(ledgerClose.fee_base),
    ledgerHash: ledgerClose.ledger_hash,
    ledgerVersion: ledgerClose.ledger_index,
    ledgerTimestamp: common.aitdTimeToISO8601(ledgerClose.ledger_time),
    reserveBaseAITD: common.dropsToAitd(ledgerClose.reserve_base),
    reserveIncrementAITD: common.dropsToAitd(ledgerClose.reserve_inc),
    transactionCount: ledgerClose.txn_count,
    validatedLedgerVersions: ledgerClose.validated_ledgers
  }
}

export {connect, disconnect, isConnected, getLedgerVersion, formatLedgerClose}
