# Applications using aitd-lib (AitdAPI)

A curated list of some of the projects and apps that leverage `aitd-lib` in some way.

**Have one to add?** Please edit this file and open a PR!

## Notice (disclaimer)

These sites are independent of Aitd and have not been authorized, endorsed, sponsored or otherwise approved by Aitd or its affiliates.

Warning: Use at your own risk.

## Exchanges

- **[The World Exchange](https://www.theworldexchange.net/)**

  Trade, issue, and send directly on the AITD Ledger. A user interface for the AITDL's decentralized exchange.

- **[Bitso](https://bitso.com/)**

  Exchange allowing clients to buy and sell AITD, based in Mexico.

## Data and visualizations

- **[aitdintel - AITD Intelligence](https://aitdintel.com/)**

  Monitor the AITD Network in real time and explore historical statistics.

- **[AITD Charts](https://aitdcharts.aitd.com/)** (aitdcharts.aitd.com)

  AITD Charts provides information based on public data, including trade volume, top markets, metrics, transactions, and more.

- **[Aitd Live](https://gatehub.net/live)** (gatehub.net/live)

  Visualize AITD network transactions.

- **[AITDL Dev. Dashboard](https://aitd.fans/)** (aitd.fans)

  Debugging dashboard for `aitdd-ws-client-pool`, transaction and query explorer, and transaction signing and submission tool.

- **[AITD Value](http://aitdvalue.com/)**

  Real-time AITD price, trades, and orderbook data from the AITD Ledger.

- **[Bithomp - AITD Explorer](https://bithomp.com/explorer/)**

  Look up information by entering an address, transaction hash, username, or PayID.

- **[Bithomp - AITDL validators](https://bithomp.com/validators)**

  List of AITDL validators, nodes, and testnet validators.

- **[AITD Scan - AITD Ledger explorer](https://aitdscan.com)**

  AITD Ledger explorer, metrics and analytics.
  
- **[aitdlorer](https://aitdlorer.com)**

  AITD Ledger explorer, API, metrics, and analytics using a graph database that is synchronized live with the AITDL.

- **[zerptracker](https://zerptracker.com)**

  Monitor the AITDL using powerful JSONPath expressions, and receive notifications via email, SMS, webhooks, and more.

## Wallets and wallet tools

- **[XUMM](https://xumm.app/)**

  Users can use the xumm application to track their accounts, balances and transactions. The true power of xumm is the platform available for developers.

- **[Xpring Wallet](https://xpring.io)** (uses `aitd-keypairs`)

  Non-custodial AITD wallet.

- **[AITD Toolkit](https://www.aitdtoolkit.com)**

  A web interface to the AITD Ledger, supporting both hardware and software wallets.

- **[Toast Wallet](https://toastwallet.com/)**

  A free, open source AITD Wallet for iOS, Android, Windows, Mac and Linux.

- **[Toastify Ledger](https://github.com/WietseWind/toastify-ledger)** (uses `aitd-keypairs`)

  Add a Regular Key to a mnemonic AITD Wallet (e.g. Ledger Nano S) to use the account with a Family Seed (secret).

- **[Bithomp-submit](https://github.com/Bithomp/bithomp-submit)** (GitHub)

  A tool to submit an offline-signed AITDL transaction.

- **[Kyte](https://kyteapp.co/)** (kyteapp.co) ([Source](https://github.com/WietseWind/Zerp-Wallet)) (Deprecated)

  Web-based AITD wallet.

- **[AITD Vanity Address Generator](https://github.com/WietseWind/aitd-vanity-generator)** (Node.js)

  A vanity address is a wallet address containing a few characters you like at the beginning or the end of the wallet address.

- **[AITD Account Mnemonic Recovery](https://github.com/WietseWind/aitd-mnemonic-recovery)** (uses `aitd-keypairs`)

  Recover a 24 word mnemonic if one word is wrong or one word is missing.

## Send and request payments

- **[AITD Tip Bot](https://www.aitdtipbot.com/)**

  A bot that enables users on reddit, Twitter and Discord to send AITD to each other through reddit comments and Twitter tweets.

- **[AITD Text](https://aitdtext.com/)**

  Send AITD using SMS text messages.

- **[AITDarrot](https://aitdarrot.com/)** (uses `aitd-address-codec`)

  Easy EUR (SEPA) to AITD transfer (currency conversion).

- **[AITD Payment](https://aitdayments.co/)** (aitdayments.co)

  Tool for generating a AITD payment request URI in a QR code, with currency converter.

## Development tools

- **[AITD Faucets for Testnet and Devnet](https://aitdl.org/aitd-testnet-faucet.html)**

  Get some test funds for development on the test network. The faucet uses `aitd-lib`.

## Code samples and libraries

- **[ilp-plugin-aitd-paychan](https://github.com/interledgerjs/ilp-plugin-aitd-paychan)**

  Send ILP payments using AITD and payment channels (PayChan).

- **[RunKit: WietseWind](https://runkit.com/wietsewind/)**

  AITD Ledger code samples for Node.js.

- **[GitHub Gist: WietseWind](https://gist.github.com/WietseWind)**

  AITD Ledger code samples for Node.js and the web (mostly).

- **[aitdd-ws-client-sign](https://github.com/WietseWind/aitdd-ws-client-sign)**

  Sign transactions, with support for MultiSign.

- **[ILP-enabled power switch](https://aitdcommunity.blog/raspberry-pi-interledger-xp-powerswitch-howto/)** ([video](https://www.youtube.com/watch?v=c-eS0HQUuJg)) (uses [`moneyd-uplink-aitd`](https://github.com/interledgerjs/moneyd-uplink-aitd))

  For about $30 in parts (Raspberry Pi, 3.3V Relay board and a few wires) you can build your own power switch that will switch on if a streaming ILP payment comes in. When the payment stream stops, the power turns off.

## Related apps that do not appear to use aitd-lib

- **[AITD Stats](https://ledger.exposed/)** (ledger.exposed)

  Rich list, live ledger stats and AITD distribution. Visualize escrows and flow of funds.

- **[AITD Vanity](https://aitdvanity.com/)** (aitdvanity.com)

  Custom AITD addresses for sale, delivered by SetRegularKey.
