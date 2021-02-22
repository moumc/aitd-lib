import keypairs from 'aitd-keypairs'
import binary from 'aitd-binary-codec'
import {validate, xrpToDrops} from '../common'

function verifyPaymentChannelClaim(
  channel: string,
  amount: string,
  signature: string,
  publicKey: string
): boolean {
  validate.verifyPaymentChannelClaim({channel, amount, signature, publicKey})

  const signingData = binary.encodeForSigningClaim({
    channel: channel,
    amount: xrpToDrops(amount)
  })
  return keypairs.verify(signingData, signature, publicKey)
}

export default verifyPaymentChannelClaim
