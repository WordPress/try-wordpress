# Receive Liberated Data

## Definitions

Each identified piece of content is referred to as
a [subject](src/plugin/class-subject.php), and hence has
a [subject type](src/plugin/enum-subject-type.php).

The act of extracting data is referred to as `liberation` and the act of using the extracted raw data to convert into a
usable form is referred to as "transformation" throughout the documentation and code.

While liberating data, we always store the raw data that we are handling in hopes of running a better transformation in
the future or any third-party plugin to transform the data upon installation of their plugin.

## Storage Architecture

Try WordPress stores all liberated data in a custom post type called `liberated_data`, exposed via a constant:
`\DotOrg\TryWordPress\Engine::STORAGE_POST_TYPE`.

We maintain references between the source data and transformed output using two post meta keys:

- `_data_liberation_source`: Points to the source content (exposed via
  `\DotOrg\TryWordPress\Transformer::META_KEY_LIBERATED_SOURCE`)
- `_data_liberation_output`: Points to the transformed output (exposed via
  `\DotOrg\TryWordPress\Transformer::META_KEY_LIBERATED_OUTPUT`)

This two-way reference allows both Try WordPress and your plugin to track relationships between original content and
transformed posts.

However, we recommend integrating using our hooks and filters. See below:

## Integration Points

One option is to have your plugin be available during data liberation and handle transformations while showing real-time
previews to the user. This is referred to as "Integration During Liberation" below.

Another option is to have your plugin be aware of liberated data and process liberated data once your plugin is
installed, preferably by walking the user through a UI. This is referred to as "Integration Post Liberation". Please do
not attempt to process data at activation as some sites can be quite large.

### Integration During Liberation

#### 1. Transform Data Your Way

Use the `data_liberated_{$subject_type}` action hook to implement your transformation logic. This hook fires after
content is liberated from the source website, giving you access to the raw data through the Subject class.

The [Subject class](src/plugin/class-subject.php) provides a
clean API to access raw data and existing transformed output:

`// @TODO provide api to access transformed output`

For example, to transform product data into your custom product post type:

```php
add_action( 'data_liberated_product', function( $subject ) {
    // process raw data
    $title = $subject->title;
    $date = $subject->date;
    $content = $subject->content;
    
    // Create a product in your custom post type
    $my_product_id = wp_insert_post( array(
        'post_type' => 'my_product_type',
        'post_title' => $title,
        'post_date' => $date,
        'post_content' => $content,
        'post_status' => 'publish',
    ) );
    
    // Store a reference to the source
    update_post_meta( $my_product_id, \DotOrg\TryWordPress\Transformer::META_KEY_LIBERATED_SOURCE, $subject->id() );
    
    // Store a reference to your transformation in the source
    $unique_plugin_slug = 'mycompany_myplugin_my_product_type'; // make sure this is unique for your plugin
    $meta_key = \DotOrg\TryWordPress\Transformer::META_KEY_LIBERATED_OUTPUT . '_' . $unique_plugin_slug; // definitely use this prefix
    update_post_meta( $subject->id(), $meta_key, $my_product_id );
} );
```

#### 2. Control the Preview

Use the `data_liberation_preview_transformed_post_id` filter to tell us which post to show in the preview. This filter
receives:

- The default transformed post ID
- The Subject instance

Here's how to show your transformed product:

```php
add_filter( 'data_liberation_preview_transformed_post_id', function( $default_post_id, $subject ) {
    // Only handle product transformations
    if ( $subject->type !== 'product' ) {
        return $default_post_id;
    }
    
    // Find your transformed product
    $unique_plugin_slug = 'mycompany_myplugin_my_product_type'; // make sure this is unique for your plugin
    $meta_key = \DotOrg\TryWordPress\Transformer::META_KEY_LIBERATED_OUTPUT . '_' . $unique_plugin_slug; // definitely use this prefix
    $product_id = get_post_meta( $subject->id(), $meta_key, true );
    return $product_id ? $product_id : $default_post_id;
}, 10, 2 );
```

### Integration Post Liberation

#### Transform Data Your Way

```php
foreach( \DotOrg\TryWordPress\Subject_Repo::loop( 'product' ) as $subject ) {
    // process raw data
    $title = $subject->title;
    $date = $subject->date;
    $content = $subject->content;
    
    // Create a product in your custom post type
    $my_product_id = wp_insert_post( array(
        'post_type' => 'my_product_type',
        'post_title' => $title,
        'post_date' => $date,
        'post_content' => $content,
        'post_status' => 'publish',
    ) );
    
    // Store a reference to the source
    update_post_meta( $my_product_id, \DotOrg\TryWordPress\Transformer::META_KEY_LIBERATED_SOURCE, $subject->id() );
    
    // Store a reference to your transformation in the source
    $unique_plugin_slug = 'mycompany_myplugin_my_product_type'; // make sure this is unique for your plugin
    $meta_key = \DotOrg\TryWordPress\Transformer::META_KEY_LIBERATED_OUTPUT . '_' . $unique_plugin_slug; // definitely use this prefix
    update_post_meta( $subject->id(), $meta_key, $my_product_id );
}
```

## Best Practices

1. Always use the Subject class's public API to access liberated data. Don't rely on internal implementation details.
2. Store references between your transformed content and the liberated data. This helps with future updates or
   re-transformations.
3. Handle errors gracefully in your transformations. Return the default post ID from your filter if anything goes wrong.
4. Document your transformations. Help users understand what your plugin does with their liberated content.

## Need Help?

Open an issue on our [GitHub repository](https://github.com/WordPress/try-wordpress) if you:

- Need additional integration points
- Have a use case not covered by current hooks
- Want to discuss your integration approach

We actively work with plugin authors to ensure Try WordPress meets real-world needs.
