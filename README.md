# aitd-lib (AitdAPI)

A JavaScript/TypeScript API for interacting with the AITD Ledger

[![NPM](https://nodei.co/npm/aitd-lib.png)](https://www.npmjs.org/package/aitd-lib)

This is the recommended library for integrating a JavaScript/TypeScript app with the AITD Ledger, especially if you intend to use advanced functionality such as IOUs, payment paths, the decentralized exchange, account settings, payment channels, escrows, multi-signing, and more.

## [➡️ Reference Documentation](https://aitdl.org/aitdapi-reference.html)

See the full reference documentation on the AITD Ledger Dev Portal.

## [➡️ Applications and Projects](APPLICATIONS.md)

What is aitd-lib used for? The applications on the list linked above use `aitd-lib`. Open a PR to add your app or project to the list!

### Features

+ Connect to a `aitdd` server from Node.js or a web browser
+ Helpers for creating requests and parsing responses for the [aitdd API](https://developers.aitd.com/aitdd-api.html)
+ Listen to events on the AITD Ledger (transactions, ledger, validations, etc.)
+ Sign and submit transactions to the AITD Ledger
+ Type definitions for TypeScript

### Requirements

+ **[Node.js v14](https://nodejs.org/)** is recommended. Other versions may work but are not frequently tested.
+ **[Yarn](https://yarnpkg.com/)** is recommended. `npm` may work but we use `yarn.lock`.

## Getting Started

See also: [AitdAPI Beginners Guide](https://aitdl.org/get-started-with-aitdapi-for-javascript.html)

In an existing project (with `package.json`), install `aitd-lib`:
```
$ yarn add aitd-lib
```

Then see the documentation:

## Documentation

+ [AitdAPI Beginners Guide](https://aitdl.org/get-started-with-aitdapi-for-javascript.html)
+ [AitdAPI Full Reference Documentation](https://aitdl.org/aitdapi-reference.html) ([in this repo](https://github.com/aitd/aitd-lib/blob/develop/docs/index.md))
+ [Code Samples](https://github.com/aitd/aitd-lib/tree/develop/docs/samples)

### Mailing Lists

We have a low-traffic mailing list for announcements of new aitd-lib releases. (About 1 email per week)

+ [Subscribe to aitd-lib-announce](https://groups.google.com/forum/#!forum/aitd-lib-announce)

If you're using the AITD Ledger in production, you should run a [aitdd server](https://github.com/aitd/aitdd) and subscribe to the aitd-server mailing list as well.

+ [Subscribe to aitd-server](https://groups.google.com/forum/#!forum/aitd-server)

## Development

To build the library for Node.js and the browser:
```
$ yarn build
```

The TypeScript compiler will [output](./tsconfig.json#L7) the resulting JS files in `./dist/npm/`.

webpack will output the resulting JS files in `./build/`.

For details, see the `scripts` in `package.json`.

## Running Tests

### Unit Tests

1. Clone the repository
2. `cd` into the repository and install dependencies with `yarn install`
3. `yarn test`

### Linting

Run `yarn lint` to lint the code with `eslint`.

## Generating Documentation

Do not edit `./docs/index.md` directly because it is a generated file.

Instead, edit the appropriate `.md.ejs` files in `./docs/src/`.

If you make changes to the JSON schemas, fixtures, or documentation sources, update the documentation by running `yarn run docgen`.

## More Information

+ [aitd-lib-announce mailing list](https://groups.google.com/forum/#!forum/aitd-lib-announce) - subscribe for release announcements
+ [AitdAPI Reference](https://aitdl.org/aitdapi-reference.html) - AITD Ledger Dev Portal
+ [AITD Ledger Dev Portal](https://aitdl.org/)

 [![Build Status](https://travis-ci.org/aitd/aitd-lib.svg?branch=master)](https://travis-ci.org/aitd/aitd-lib)
