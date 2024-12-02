<?php
/**
 * Setup for running tests would come here.
 */

// for crawler controller
wp_insert_post(
	array(
		'post_type'   => \DotOrg\TryWordPress\Engine::LIBERATED_DATA_POST_TYPE,
		'title'       => 'something to avoid empty filter',
		'guid'        => 'https://example.org/1',
		'post_status' => 'draft',
	)
);
