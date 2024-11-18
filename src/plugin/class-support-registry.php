<?php

namespace DotOrg\TryWordPress;

use InvalidArgumentException;

class SupportRegistry {
	private static array $handlers = array();

	/**
	 * Register a support handler for a specific subject type
	 *
	 * @param string   $subject_type The type of subject to handle.
	 * @param callable $handler The handler function.
	 * @return void
	 * @throws InvalidArgumentException If handler is not callable.
	 */
	public static function register_subject_support( string $subject_type, callable $handler ): void {
		if ( ! is_callable( $handler ) ) {
			throw new InvalidArgumentException( 'Handler must be callable' );
		}

		if ( ! isset( self::$handlers[ $subject_type ] ) ) {
			self::$handlers[ $subject_type ] = array();
		}

		// Add handler to the registry
		self::$handlers[ $subject_type ][] = $handler;
	}

	/**
	 * Check if support exists for a subject type
	 *
	 * @param string $subject_type The type of subject.
	 * @return bool True if support exists
	 */
	public static function has_support( string $subject_type ): bool {
		return isset( self::$handlers[ $subject_type ] ) && ! empty( self::$handlers[ $subject_type ] );
	}

	/**
	 * Handle a subject with registered handlers
	 *
	 * @param string     $subject_type The type of subject to handle.
	 * @param mixed|null $data Data to pass to handlers.
	 * @return array Results from all handlers
	 */
	public static function handle_subject( string $subject_type, mixed $data = null ): array {
		if ( ! self::has_support( $subject_type ) ) {
			return array();
		}

		$results = array();
		foreach ( self::$handlers[ $subject_type ] as $handler ) {
			$results[] = $handler( $data );
		}

		return $results;
	}

	/**
	 * Remove all handlers for a subject type
	 *
	 * @param string $subject_type The type of subject to clear handlers for.
	 * @return void
	 */
	public static function clear_handlers( string $subject_type ): void {
		if ( isset( self::$handlers[ $subject_type ] ) ) {
			unset( self::$handlers[ $subject_type ] );
		}
	}
}
