export interface Amount extends Issue {
  value: string
}

export type AitddAmount = string | Amount

/**
 * Specification of which currency the account taking the offer would pay/
 * receive, as an object with currency and issuer fields (omit issuer for AITD).
 * Similar to currency amounts.
 */
export interface TakerRequestAmount {
  currency: string
  issuer?: string
}

/**
 * A currency-counterparty pair, or just currency if it's AITD.
 */
export interface Issue {
  currency: string
  issuer?: string
  counterparty?: string
}
