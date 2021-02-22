const port = 34371
import {createMockAitdd} from './mock-aitdd'

function main() {
  if (global.describe) {
    // we are running inside mocha, exiting
    return
  }
  console.log('starting server on port ' + port)
  createMockAitdd(port)
  console.log('starting server on port ' + String(port + 1))
  createMockAitdd(port + 1)
}

main()
