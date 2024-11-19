Extending Try-WP
================

Try-WP browser extension (part of [Data Liberation initiative](https://wordpress.org/data-liberation/)) collabrates with
the user to understand their website markup before crawling and extracting data. This act of extracting data and sending
it to a WordPress install running right in your browser (via [WordPress playground](https://wordpress.org/playground/))
is referred to as `liberation` in the documentation and code.

Each identified piece of content is referred to as
a [subject](https://github.com/WordPress/try-wordpress/blob/devex/src/plugin/class-subject.php), and hence has
a [subject type](https://github.com/WordPress/try-wordpress/blob/devex/src/plugin/subject-type.php).

The act of using the extracted raw data to convert into a usable form is referred to as "transformation" throughout the
documentation and code.

While liberating data, we always store the raw data that we are handling in hopes of running a better transformation in
the future or any third-party plugin to transform the data upon installation of their plugin.

Third-party plugin (3PP) authors looking to integrate their plugin with this browser extension, have the following
options:

1) Offer integration during data liberation
2) Offer integration after data liberation

## Offer integration *during* data liberation

Note: This obviously requires your plugin being installed and activated before the user starts the liberation.

3PP authors can choose to register support for handling certain types of Subject, completely disabling native
transformations and then transform every time data is saved incrementally for that subject.

Ensure you return the post ID of what's meant to be the result for that Subject & preview is automatically handled.

### How to run your own transformations disabling native transformations?

```php
add_action( 'init', function() {
    // register your handler
    DotOrg\TryWordPress\Ops::handle(
        DotOrg\TryWordPress\SubjectType::PRODUCT,
        function( DotOrg\TryWordPress\Subject $data ) {
            // run your transformations and return the post id that was created
            $post_id = wp_insert_post( array( 'post_type' => 'your_post_type' ) );
            
            return $post_id;
    } );
} );
```

Having more than one plugin competing for a type of subject would cause an error and must be resolved before we
continue.
So, you must provide the means to turn off your handling for the user.

If your use-case doesn't involve visual changes, such as handling SEO meta tags, you can just observe without disabling
native/overridden transformations as they are handled.

### How to just observe transformations without disabling native transformations?

```php
add_action( 'init', function() {
    DotOrg\TryWordPress\Ops::observe(
        DotOrg\TryWordPress\SubjectType::PRODUCT,
        func( DotOrg\TryWordPress\Subject $data ) {
            // do meta stuff like SEO tags
        }
    );
} );
```

## Offer integration *after* data liberation

Post data liberation, both raw data and native transformations exist in the database. You must offer transformations in
a way that user can preview the changes without committing to it.

To achieve this user experience, we provide the API to query relevant data,
suspend native transformations,
the ability to run your transformations one by one,
and finally persist them if user confirms they want your transformations to take over the native transformations
or resume native transformations after you revert the output of your transformations.

### How to run your transformations?

```php
foreach( DotOrg\TryWordPress\Ops::loop( $subject_type ) as DotOrg\TryWordPress\Subject $subject ) {
    DotOrg\TryWordPress\Ops::suspend( $subject );
    
    // @TODO: Run your transformations here, using the data
    // Example:
    // $your_post_id = consume( $subject );
    
    if ( $user_likes_it ) {
        // delete native transformation output and mark your transformation output as final
        persist( $subject, $your_post_id );
    } else {
        DotOrg\TryWordPress\Ops::resume( $subject );
    }
}
```

Practically, this won't happen in a single loop as shown above, since you would suspend all subjects & run your
transformations, before offering a preview to the user.
And only when the user confirms the preview of their website,
they would decide they want to continue with your transformation or revert back.

And, again, if your use-case doesn't involve visual changes, you can just loop through to read data without any suspend
calls and do your changes keeping user's best interests in mind.
Always provide the means to revert the changes done under "Data Liberation" if the user wishes for it in the future.
