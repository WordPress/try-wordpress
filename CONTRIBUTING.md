## Contribute

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
npm run build:firefox
# or
npm run build:chrome
```

You can then use the `start` script to start a browser instance separate from your main instance that has the extension automatically installed:

```shell
npm run start:firefox
# or
npm run start:chrome
```

The extension will also automatically reload whenever you modify source files.

> Please note that at the moment not all `web-ext` features work on chrome, so firefox is the recommended browser for developing this project, since it provides the best developer experience. One example of a `web-ext` feature that doesn't currently work on chrome is to have the developer tools and extension console automatically open when the extension loads.

### Firefox publication identity and data disclosure

The Firefox Manifest V3 Gecko ID `try-your-website-in-wordpress@wordpress.org` is provisional and may be changed until the extension is first published. After publication, treat the published ID as stable because changing it creates a distinct Firefox extension identity.

Firefox 142.0 is the minimum supported version. Firefox's built-in data-collection consent experience begins at desktop version 140 and Android version 142; selecting the common version 142 floor prevents any direct Android install from inheriting a version that predates its built-in consent while omitting `gecko_android` keeps the AMO package desktop-only. The extension does not implement a separate legacy consent flow, so older versions are excluded through `browser_specific_settings.gecko.strict_min_version`.

The extension transmits selected source-page HTML, text, and links, plus selected source URLs and domains, to the WordPress Playground running in the remote-origin `https://pg.ashfame.com/remote.html` iframe. The Firefox manifest therefore declares the required `websiteContent` and `browsingActivity` data categories; element-selection clicks and pointer movement stay local and are not declared as `websiteActivity`.

Production packages can be checked after building both targets:

```shell
npm run validate:extension-builds
npm run lint:extension:firefox
```

The package validator confirms that both production manifests parse and every referenced content/background script, sidebar/side-panel page, and icon exists. The Firefox lint gate ignores only generated `app.js` and requires zero errors and exactly the known unsupported-Chrome-API warning.

## Development environment - WordPress plugin

First install required dependencies:

```shell
composer install
```

The development environment requires [wp-env](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-env/), you can install it with:

```shell
npm install -g @wordpress/env
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
