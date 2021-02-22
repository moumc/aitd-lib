import {AitdAPI, AitdAPIBroadcast} from 'aitd-api'
import ledgerClosed from './fixtures/aitdd/ledger-close.json'

const port = 34371
const baseUrl = 'ws://testaitd.circleci.com:'

function setup(this: any, port_ = port) {
  const tapi = new AitdAPI({server: baseUrl + port_})
  return tapi
    .connect()
    .then(() => {
      return tapi.connection.request({
        command: 'test_command',
        data: {openOnOtherPort: true}
      })
    })
    .then((got) => {
      return new Promise((resolve, reject) => {
        this.api = new AitdAPI({server: baseUrl + got.port})
        this.api
          .connect()
          .then(() => {
            this.api.once('ledger', () => resolve())
            this.api.connection._ws.emit(
              'message',
              JSON.stringify(ledgerClosed)
            )
          })
          .catch(reject)
      })
    })
    .then(() => {
      return tapi.disconnect()
    })
}

function setupBroadcast(this: any) {
  const servers = [port, port + 1].map((port_) => baseUrl + port_)
  this.api = new AitdAPIBroadcast(servers)
  return new Promise((resolve, reject) => {
    this.api
      .connect()
      .then(() => {
        this.api.once('ledger', () => resolve())
        this.api._apis[0].connection._ws.emit(
          'message',
          JSON.stringify(ledgerClosed)
        )
      })
      .catch(reject)
  })
}

function teardown(this: any) {
  if (this.api.isConnected()) {
    return this.api.disconnect()
  }
  return undefined
}

export default {
  setup: setup,
  teardown: teardown,
  setupBroadcast: setupBroadcast
}
