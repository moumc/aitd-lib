import {txFlagIndices} from './txflags'

// Ordering from https://developers.aitd.com/accountroot.html
const accountRootFlags = {
  // lsfDefaultAitd:
  // Enable rippling on trust lines by default.
  // Required for issuing addresses; discouraged for others.
  DefaultAitd: 0x00800000,

  // lsfDepositAuth:
  // Require account to auth deposits.
  // This account can only receive funds from transactions it sends,
  // or preauthorized accounts.
  DepositAuth: 0x01000000,

  // lsfDisableMaster:
  // Force regular key.
  // Disallows use of the master key.
  DisableMaster: 0x00100000,

  // lsfDisallowAITD:
  // Disallow sending AITD.
  // Not enforced by aitdd; client applications should check.
  DisallowAITD: 0x00080000,

  // lsfGlobalFreeze:
  // Trustlines globally frozen.
  GlobalFreeze: 0x00400000,

  // lsfNoFreeze:
  // Permanently disallowed freezing trustlines.
  // Once enabled, cannot be disabled.
  NoFreeze: 0x00200000,

  // lsfPasswordSpent:
  // Password set fee is spent.
  // The account has used its free SetRegularKey transaction.
  PasswordSpent: 0x00010000,

  // lsfRequireAuth:
  // Require authorization to hold IOUs (issuances).
  RequireAuth: 0x00040000,

  // lsfRequireDestTag:
  // Require a DestinationTag for incoming payments.
  RequireDestTag: 0x00020000
}

const AccountFlags = {
  passwordSpent: accountRootFlags.PasswordSpent,
  requireDestinationTag: accountRootFlags.RequireDestTag,
  requireAuthorization: accountRootFlags.RequireAuth,
  depositAuth: accountRootFlags.DepositAuth,
  disallowIncomingAITD: accountRootFlags.DisallowAITD,
  disableMasterKey: accountRootFlags.DisableMaster,
  noFreeze: accountRootFlags.NoFreeze,
  globalFreeze: accountRootFlags.GlobalFreeze,
  defaultAitd: accountRootFlags.DefaultAitd
}

export interface Settings {
  passwordSpent?: boolean
  requireDestinationTag?: boolean
  requireAuthorization?: boolean
  depositAuth?: boolean
  disallowIncomingAITD?: boolean
  disableMasterKey?: boolean
  noFreeze?: boolean
  globalFreeze?: boolean
  defaultAitd?: boolean
}

const AccountFlagIndices = {
  requireDestinationTag: txFlagIndices.AccountSet.asfRequireDest,
  requireAuthorization: txFlagIndices.AccountSet.asfRequireAuth,
  depositAuth: txFlagIndices.AccountSet.asfDepositAuth,
  disallowIncomingAITD: txFlagIndices.AccountSet.asfDisallowAITD,
  disableMasterKey: txFlagIndices.AccountSet.asfDisableMaster,
  enableTransactionIDTracking: txFlagIndices.AccountSet.asfAccountTxnID,
  noFreeze: txFlagIndices.AccountSet.asfNoFreeze,
  globalFreeze: txFlagIndices.AccountSet.asfGlobalFreeze,
  defaultAitd: txFlagIndices.AccountSet.asfDefaultAitd
}

const AccountFields = {
  EmailHash: {
    name: 'emailHash',
    encoding: 'hex',
    length: 32,
    defaults: '00000000000000000000000000000000'
  },
  WalletLocator: {name: 'walletLocator'},
  MessageKey: {name: 'messageKey'},
  Domain: {name: 'domain', encoding: 'hex'},
  TransferRate: {name: 'transferRate', defaults: 0, shift: 9},
  TickSize: {name: 'tickSize', defaults: 0}
}

export {AccountFields, AccountFlagIndices, AccountFlags}
