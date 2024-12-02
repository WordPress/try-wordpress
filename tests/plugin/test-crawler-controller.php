<?php

use DotOrg\TryWordPress\Crawler_Controller;
use PHPUnit\Framework\TestCase;

class Crawler_Controller_Test extends TestCase {
	private Crawler_Controller $crawler_controller;

	private string $domain    = 'https://example.org';
	private string $namespace = 'try-wp/v1';
	private string $endpoint;
	private string $crawler_queue_post_type = 'dl_crawl';

	protected function setUp(): void {
		parent::setUp();

		$this->endpoint = '/' . $this->namespace . '/crawler';

		// Note: `base-test.php` sets a `liberated_data` post

		$this->crawler_controller = new Crawler_Controller(
			$this->domain,
			$this->crawler_queue_post_type
		);
	}

	public function testRegisterRoutes(): void {
		// do_action( 'rest_api_init' ); // so that register_route() executes.

		$routes = rest_get_server()->get_routes( $this->namespace );
		$this->assertArrayHasKey( $this->endpoint . '/next', $routes );
		$this->assertArrayHasKey( $this->endpoint . '/queue', $routes );
	}

	/**
	 * @group failing
	 */
	public function testGetNextUrlWithoutQueue(): void {
		// first fetch should return the domain itself since that's the first url to crawl
		$request  = new WP_REST_Request( 'GET', $this->endpoint . '/next' );
		$response = rest_do_request( $request );

		$this->assertEquals( 200, $response->get_status() );
		$this->assertEquals( $this->domain, $response->get_data() );
	}

	public function testQueueUrls(): void {
		// first fetch should return the domain itself since that's the first url to crawl
		$request  = new WP_REST_Request( 'GET', $this->endpoint . '/queue' );
		$response = rest_do_request( $request );

		$this->assertEquals( 200, $response->get_status() );
		$this->assertEquals( $this->domain, $response->get_data() );
	}

	public function testGetNextUrlFromQueue(): void {
		// first fetch should return the domain itself since that's the first url to crawl
		$request  = new WP_REST_Request( 'GET', $this->endpoint . '/next' );
		$response = rest_do_request( $request );

		$this->assertEquals( 200, $response->get_status() );
		$this->assertEquals( $this->domain, $response->get_data() );
	}
}
