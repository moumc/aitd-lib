import * as _ from 'lodash'
import BigNumber from 'bignumber.js'
import {getAITDBalance, renameCounterpartyToIssuer} from './utils'
import {
  validate,
  toAitddAmount,
  errors,
  aitdToDrops,
  dropsToAitd
} from '../common'
import {Connection} from '../common'
import parsePathfind from './parse/pathfind'
import {AitddAmount, Amount} from '../common/types/objects'
import {
  GetPaths,
  PathFind,
  AitddPathsResponse,
  PathFindRequest
} from './pathfind-types'
import {AitdAPI} from '..'
const NotFoundError = errors.NotFoundError
const ValidationError = errors.ValidationError

function addParams(
  request: PathFindRequest,
  result: AitddPathsResponse
): AitddPathsResponse {
  return _.defaults(
    _.assign({}, result, {
      source_account: request.source_account,
      source_currencies: request.source_currencies
    }),
    {destination_amount: request.destination_amount}
  )
}

function requestPathFind(
  connection: Connection,
  pathfind: PathFind
): Promise<AitddPathsResponse> {
  const destinationAmount: Amount = _.assign(
    {
      // This is converted back to drops by toAitddAmount()
      value:
        pathfind.destination.amount.currency === 'AITD' ? dropsToAitd('-1') : '-1'
    },
    pathfind.destination.amount
  )
  const request: PathFindRequest = {
    command: 'aitd_path_find',
    source_account: pathfind.source.address,
    destination_account: pathfind.destination.address,
    destination_amount: toAitddAmount(destinationAmount)
  }
  if (
    typeof request.destination_amount === 'object' &&
    !request.destination_amount.issuer
  ) {
    // Convert blank issuer to sender's address
    // (Aitd convention for 'any issuer')
    // https://developers.aitd.com/payment.html#special-issuer-values-for-sendmax-and-amount
    request.destination_amount.issuer = request.destination_account
  }
  if (pathfind.source.currencies && pathfind.source.currencies.length > 0) {
    request.source_currencies = pathfind.source.currencies.map((amount) =>
      renameCounterpartyToIssuer(amount)
    )
  }
  if (pathfind.source.amount) {
    if (pathfind.destination.amount.value !== undefined) {
      throw new ValidationError(
        'Cannot specify both source.amount' +
          ' and destination.amount.value in getPaths'
      )
    }
    request.send_max = toAitddAmount(pathfind.source.amount)
    if (typeof request.send_max !== 'string' && !request.send_max.issuer) {
      request.send_max.issuer = pathfind.source.address
    }
  }

  return connection.request(request).then((paths) => addParams(request, paths))
}

function addDirectAitdPath(
  paths: AitddPathsResponse,
  aitdBalance: string
): AitddPathsResponse {
  // Add AITD "path" only if the source acct has enough AITD to make the payment
  const destinationAmount = paths.destination_amount
  // @ts-ignore: destinationAmount can be a currency amount object! Fix!
  if (new BigNumber(aitdBalance).isGreaterThanOrEqualTo(destinationAmount)) {
    paths.alternatives.unshift({
      paths_computed: [],
      source_amount: paths.destination_amount
    })
  }
  return paths
}

function isAitddIOUAmount(amount: AitddAmount) {
  // aitdd AITD amounts are specified as decimal strings
  return (
    typeof amount === 'object' && amount.currency && amount.currency !== 'AITD'
  )
}

function conditionallyAddDirectAITDPath(
  connection: Connection,
  address: string,
  paths: AitddPathsResponse
): Promise<AitddPathsResponse> {
  if (
    isAitddIOUAmount(paths.destination_amount) ||
    !_.includes(paths.destination_currencies, 'AITD')
  ) {
    return Promise.resolve(paths)
  }
  return getAITDBalance(connection, address, undefined).then((aitdBalance) =>
    addDirectAitdPath(paths, aitdBalance)
  )
}

function filterSourceFundsLowPaths(
  pathfind: PathFind,
  paths: AitddPathsResponse
): AitddPathsResponse {
  if (
    pathfind.source.amount &&
    pathfind.destination.amount.value === undefined &&
    paths.alternatives
  ) {
    paths.alternatives = _.filter(paths.alternatives, (alt) => {
      if (!alt.source_amount) {
        return false
      }
      const pathfindSourceAmountValue = new BigNumber(
        pathfind.source.amount.currency === 'AITD'
          ? aitdToDrops(pathfind.source.amount.value)
          : pathfind.source.amount.value
      )
      const altSourceAmountValue = new BigNumber(
        typeof alt.source_amount === 'string'
          ? alt.source_amount
          : alt.source_amount.value
      )
      return altSourceAmountValue.eq(pathfindSourceAmountValue)
    })
  }
  return paths
}

function formatResponse(pathfind: PathFind, paths: AitddPathsResponse) {
  if (paths.alternatives && paths.alternatives.length > 0) {
    return parsePathfind(paths)
  }
  if (
    paths.destination_currencies !== undefined &&
    !_.includes(
      paths.destination_currencies,
      pathfind.destination.amount.currency
    )
  ) {
    throw new NotFoundError(
      'No paths found. ' +
        'The destination_account does not accept ' +
        pathfind.destination.amount.currency +
        ', they only accept: ' +
        paths.destination_currencies.join(', ')
    )
  } else if (paths.source_currencies && paths.source_currencies.length > 0) {
    throw new NotFoundError(
      'No paths found. Please ensure' +
        ' that the source_account has sufficient funds to execute' +
        ' the payment in one of the specified source_currencies. If it does' +
        ' there may be insufficient liquidity in the network to execute' +
        ' this payment right now'
    )
  } else {
    throw new NotFoundError(
      'No paths found.' +
        ' Please ensure that the source_account has sufficient funds to' +
        ' execute the payment. If it does there may be insufficient liquidity' +
        ' in the network to execute this payment right now'
    )
  }
}

function getPaths(this: AitdAPI, pathfind: PathFind): Promise<GetPaths> {
  validate.getPaths({pathfind})

  const address = pathfind.source.address
  return requestPathFind(this.connection, pathfind)
    .then((paths) =>
      conditionallyAddDirectAITDPath(this.connection, address, paths)
    )
    .then((paths) => filterSourceFundsLowPaths(pathfind, paths))
    .then((paths) => formatResponse(pathfind, paths))
}

export default getPaths
