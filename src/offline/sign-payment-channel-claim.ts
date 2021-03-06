import * as common from '../common'
import keypairs from 'aitd-keypairs'
import binary from 'aitd-binary-codec'
const {validate, aitdToDrops} = common

function signPaymentChannelClaim(
  channel: string,
  amount: string,
  privateKey: string
): string {
  validate.signPaymentChannelClaim({channel, amount, privateKey})

  const signingData = binary.encodeForSigningClaim({
    channel: channel,
    amount: aitdToDrops(amount)
  })
  return keypairs.sign(signingData, privateKey)
}

export default signPaymentChannelClaim
