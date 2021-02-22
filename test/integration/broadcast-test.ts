import {AitdAPIBroadcast} from '../../src'

function main() {
  const servers = ['wss://s1.aitd.com', 'wss://s2.aitd.com']
  const api = new AitdAPIBroadcast(servers)
  api.connect().then(() => {
    api.getServerInfo().then((info) => {
      console.log(JSON.stringify(info, null, 2))
    })
    api.on('ledger', (ledger) => {
      console.log(JSON.stringify(ledger, null, 2))
    })
  })
}

main()
