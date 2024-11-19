<?php

namespace DotOrg\TryWordPress;

use InvalidArgumentException;

class HandlerRegistry {
	private static array $handlers = array();

	/**
	 * Add a handler for a specific type
	 *
	 * @param string   $type The type to handle.
	 * @param callable $handler The handler function.
	 * @return void
	 * @throws InvalidArgumentException If handler is not callable.
	 */
	public static function add( string $type, callable $handler ): void {
		if ( ! is_callable( $handler ) ) {
			throw new InvalidArgumentException( 'Handler must be callable' );
		}

		if ( ! isset( self::$handlers[ $type ] ) ) {
			self::$handlers[ $type ] = array();
		}

		self::$handlers[ $type ][] = $handler;
	}

	/**
	 * Check if handlers exist for a type
	 *
	 * @param string $type The type to check.
	 * @return bool True if handlers exist
	 */
	public static function has( string $type ): bool {
		return isset( self::$handlers[ $type ] ) && ! empty( self::$handlers[ $type ] );
	}

	/**
	 * Execute all handlers for a type
	 *
	 * @TODO: Invoke this function at the right place in code
	 *
	 * @param string     $type The type to handle.
	 * @param mixed|null $data Data to pass to handlers.
	 * @return array Results from all handlers
	 */
	public static function handle( string $type, mixed $data = null ): array {
		if ( ! self::has( $type ) ) {
			return array();
		}

		$results = array();
		foreach ( self::$handlers[ $type ] as $handler ) {
			$results[] = $handler( $data );
		}

		return $results;
	}

	/**
	 * Remove all handlers for a type
	 *
	 * @param string $type The type to clear handlers for.
	 * @return void
	 */
	public static function clear( string $type ): void {
		if ( isset( self::$handlers[ $type ] ) ) {
			unset( self::$handlers[ $type ] );
		}
	}
}
