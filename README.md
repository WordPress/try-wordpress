# Try WordPress
Data Liberation browser extension powered by WordPress Playground.

## Development environment
This repo provides a development environment that facilitates developing the browser extension, using the [`web-ext`](https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/) tool.

First install required dependencies:

```shell
npm install
```

Then build the extension:

```shell
npm run build
```

You can then use the `start` script to start a browser instance separate from your main instance that has the extension automatically installed:

```shell
npm run start # currently defaults to Firefox
npm run start:firefox
npm run start:chrome
```

The extension will also automatically reload whenever you modify source files.

> Please note that at the moment not all `web-ext` features work on chrome, so firefox is the recommended browser for developing this project, since it provides the best developer experience. One example of a `web-ext` feature that doesn't currently work on chrome is to have the developer tools and extension console automatically open when the extension loads.


## Building for production
You can build both the firefox and chrome versions of the extension with the following command. The resulting files will be under the `build/firefox` and `build/chrome` directories, respectively.

```shell
npm run build
```

## Running tests
You can run tests with:

```shell
npm run test
```
