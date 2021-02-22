import {AitdAPI, AitdAPIBroadcast} from 'aitd-api'
import ledgerClosed from './fixtures/aitdd/ledger-close.json'
import {createMockAitdd} from './mock-aitdd'
import {getFreePort} from './utils'

function setupMockAitddConnection(testcase, port) {
  return new Promise((resolve, reject) => {
    testcase.mockAitdd = createMockAitdd(port)
    testcase._mockedServerPort = port
    testcase.api = new AitdAPI({server: 'ws://localhost:' + port})
    testcase.api
      .connect()
      .then(() => {
        testcase.api.once('ledger', () => resolve())
        testcase.api.connection._ws.emit(
          'message',
          JSON.stringify(ledgerClosed)
        )
      })
      .catch(reject)
  })
}

function setupMockAitddConnectionForBroadcast(testcase, ports) {
  return new Promise((resolve, reject) => {
    const servers = ports.map((port) => 'ws://localhost:' + port)
    testcase.mocks = ports.map((port) => createMockAitdd(port))
    testcase.api = new AitdAPIBroadcast(servers)
    testcase.api
      .connect()
      .then(() => {
        testcase.api.once('ledger', () => resolve())
        testcase.mocks[0].socket.send(JSON.stringify(ledgerClosed))
      })
      .catch(reject)
  })
}

function setup(this: any) {
  return getFreePort().then((port) => {
    return setupMockAitddConnection(this, port)
  })
}

function setupBroadcast(this: any) {
  return Promise.all([getFreePort(), getFreePort()]).then((ports) => {
    return setupMockAitddConnectionForBroadcast(this, ports)
  })
}

function teardown(this: any, done) {
  this.api
    .disconnect()
    .then(() => {
      if (this.mockAitdd !== undefined) {
        this.mockAitdd.close()
      } else {
        this.mocks.forEach((mock) => mock.close())
      }
      setImmediate(done)
    })
    .catch(done)
}

export default {
  setup: setup,
  teardown: teardown,
  setupBroadcast: setupBroadcast,
  createMockAitdd: createMockAitdd
}
