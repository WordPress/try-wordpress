Extending Try-WP
================

3rd party plugin authors looking to integrate their plugin in Data liberation initiative, have the following options:

1) Offer integration during data liberation
2) Offer integration after data liberation

## Offer integration *during* data liberation

To offer a rich experience, plugin authors can choose to register support for handling certain subject_type(s) and then
transform every time data is saved incrementally for that subject_type.

Registering support for a subject_type automatically turns off native support for it, so you are responsible to do the
following:

1) Save data as it comes in
2) Run transformations on each save
3) Render preview

## Offer integration *after* data liberation

For a rich experience, we recommend plugin authors to use WP Playground to spin up a staging environment of the current
website in which you would run transformations (how on this later), to offer them a preview of their website would look
after they choose your plugin to transform raw data of a specific subject_type.
Only when the user approves the transformed data, you should move forward with running your transformations of raw data
in actual website and delete the native transformed data.

Alternatively, you can choose to suspend the previously transformed data when showing preview of your transformed data.
Persist to finalise it, else resume to unsuspend the previously transformed data and delete data related to your
transformation.

And, if your use case, doesn't involve offering visual/layout/aesthetic changes at all, you can continue to just read
data and run transformations sensibly keeping user's best interests in mind.

### How to run your transformations?

```php
foreach( DotOrg\TryWordPress\Ops::loop( $subject_type ) as $liberated_post ) {
    DotOrg\TryWordPress\Ops::suspend( $liberated_post );
    
    // @TODO: Run your transformations here, using the data
    // Example:
    // $your_post_id = consume( $liberated_post );
    
    if ( ! Dotorg\TryWordPress\Ops::is_preview() ) {
        // delete native transformation output and mark your transformation output as final
        persist( $liberated_post, $your_post_id );
    }
}
```
