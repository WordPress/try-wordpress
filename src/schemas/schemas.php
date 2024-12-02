<?php namespace DotOrg\TryWordPress;

function get_schema( string $subject_type ): array|null {
	$path = __DIR__ . "/../schemas/$subject_type.json";
	if ( ! file_exists( $path ) ) {
		return null;
	}

	// phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
	return json_decode( file_get_contents( $path ), true );
}
