## Contribute

This repo provides a development environment that facilitates:

- Developing the browser extension, using the [`web-ext`](https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/) tool.
- Developing the WordPress plugin that is used under WordPress Playground, using [`wp-env`](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-env/).

## Development environment - Browser extension

Use Node 24 as selected by `.nvmrc`, then install the exact locked dependencies:

```shell
nvm use
npm ci
```

Build both development targets sequentially:

```shell
npm run build
```

The Firefox development build is written to `build/firefox`, and the Chrome development build is written to `build/chrome`. To build only one target:

```shell
npm run build:firefox
# or
npm run build:chrome
```

Use a target-specific start command to build the target, open a separate browser instance with the extension installed, watch source files, and automatically reload the extension:

```shell
npm run start:firefox
# or
npm run start:chrome
```

> Please note that at the moment not all `web-ext` features work on Chrome, so Firefox is the recommended browser for developing this project because it provides the best developer experience. For example, Chrome does not support automatically opening the developer tools and extension console when the extension loads.

### Firefox publication identity and data disclosure

The Firefox Manifest V3 Gecko ID `try-your-website-in-wordpress@wordpress.org` is provisional and may be changed until the extension is first published. After publication, treat the published ID as stable because changing it creates a distinct Firefox extension identity.

Firefox 142.0 is the minimum supported version. Firefox's built-in data-collection consent experience begins at desktop version 140 and Android version 142; selecting the common version 142 floor prevents any direct Android install from inheriting a version that predates its built-in consent while omitting `gecko_android` keeps the AMO package desktop-only. The extension does not implement a separate legacy consent flow, so older versions are excluded through `browser_specific_settings.gecko.strict_min_version`.

The extension transmits selected source-page HTML, text, and links, plus selected source URLs and domains, to the WordPress Playground running in the remote-origin `https://pg.ashfame.com/remote.html` iframe. The Firefox manifest therefore declares the required `websiteContent` and `browsingActivity` data categories; element-selection clicks and pointer movement stay local and are not declared as `websiteActivity`.

Build both production targets sequentially:

```shell
npm run build:production
```

The Firefox production build is written to `build/production/firefox`, and the Chrome production build is written to `build/production/chrome`. After building both production targets, validate the packaged references and lint the Firefox package:

```shell
npm run validate:extension-builds
npm run lint:extension:firefox
```

The package validator confirms that both production manifests parse and every referenced content/background script, sidebar/side-panel page, and icon exists. The Firefox lint gate ignores only generated `app.js` and requires zero errors and exactly the known unsupported-Chrome-API warning.

## Development environment - WordPress plugin

Install the locked PHP dependencies:

```shell
composer install
```

The development environment requires [wp-env](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-env/). Install its executable globally if it is not already available:

```shell
npm install -g @wordpress/env
```

Start the development environment:

```shell
composer run dev:start
```

Docker Engine must be running because `wp-env` uses containers. This command starts the WordPress environment and sets up the permalink structure.

Stop the development environment:

```shell
composer run dev:stop
```

Start the environment with Xdebug:

```shell
composer run dev:debug
```

Lint the plugin with PHPCS:

```shell
composer run lint
```

Automatically fix eligible PHPCS issues:

```shell
composer run lint:fix
```

## Verification

There is currently no frontend test suite. Validate the browser extension with the actual static-analysis, build, package-reference, and Firefox manifest gates:

```shell
npm run lint
npm run type-check
npm run build:production
npm run validate:extension-builds
npm run lint:extension:firefox
```

Lint the WordPress plugin:

```shell
composer run lint
```

With Docker Engine running and the WordPress environment started through `composer run dev:start`, run the complete PHPUnit suite:

```shell
composer run dev:test
```

This command runs the complete plugin suite in the WordPress test container using PHPUnit.
