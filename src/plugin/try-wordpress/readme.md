# `try-wordpress` WordPress plugin

## Development Notes

- The plugin uses WordPress Coding Standards for PHP.
- PHP version 8.3 is used for both development and testing environments.
- The `wp-env` tool is used to manage the local WordPress development environment.

## Development Setup

1. Install dependencies:
   ```shell
   composer install
   ```

2. Start the development environment:
   ```shell
   composer run dev:start
   ```

   This command starts the WordPress environment and sets up the permalink structure.

3. To stop the development environment:
   ```shell
   composer run dev:stop
   ```

4. For debugging with Xdebug:
   ```shell
   composer run dev:debug
   ```

## Linting

To run linting on the codebase:

```shell
composer run lint
```

To automatically fix linting issues:

```shell
composer run lint:fix
```

## Running Tests

To run PHPUnit tests:

```shell
composer run dev:test
```

This command runs the tests in the WordPress environment using PHPUnit.