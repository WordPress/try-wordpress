# Try WordPress
Data Liberation browser extension powered by WordPress Playground.

This repo provides a development environment that facilitates:

- Developing the browser extension, using the [`web-ext`](https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/) tool.
- Developing the WordPress plugin that is used under WordPress Playground, using [`wp-env`](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-env/).

## Development environment - Browser extension

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

## Development environment - WordPress plugin

First install required dependencies:

```shell
composer install
```

Start the development environment:
```shell
composer run dev:start
```

You will need docker engine running for this command to work, since `wp-env` uses container that runs on docker engine.
This command starts the WordPress environment and sets up the permalink structure.

To stop the development environment:
```shell
composer run dev:stop
```

Additionally, there is also support for `xdebug`, `phpcs` and `phpcbf`:

For debugging with Xdebug:
```shell
composer run dev:debug
```

To run linting on the codebase:
```shell
composer run lint
```

To automatically fix linting issues:
```shell
composer run lint:fix
```

## Building for production
You can build both the firefox and chrome versions of the extension with the following command. The resulting files will be under the `build/firefox` and `build/chrome` directories, respectively.

```shell
npm run build
```

> We would soon have the build & release pipeline for publishing the plugin to WP.org repo.

## Running tests

You can run tests with:

**For browser extension:**

```shell
npm run test
```

**For WordPress plugin:**

```shell
composer run dev:test
```
This command runs the tests in the WordPress environment using PHPUnit.
