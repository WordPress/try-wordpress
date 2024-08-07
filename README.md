# Try WordPress
Data Liberation browser extension powered by WordPress Playground.

It is composed of 3 main parts:
- `/background` The service worker.
- `/content` The functionality that copies the HTML and formats it for pasting.
- `/wp-plugin` Some modifications that run when using the block editor to make copy/pasting possible.


## Setup
### Scripts
1. `npm install` Install dependencies.
1. `npm build` Compiles JavaScript into `build` folder.
1. `npm test` Run test suites.

## Project Structure
### `/background`

In Chrome extensions, the service worker, introduced with Manifest V3, acts as a background script that runs independently of the extension's UI. It handles various background tasks such as event handling, network request management, alarms, and inter-component communication, while being more efficient and secure than the previous background pages. Service workers are event-driven and activate only when needed, which conserves resources and improves performance. This shift enhances the reliability, efficiency, and security of Chrome extensions.
 
### `/content`

This is the Interface for copying HTML and adding it to the clipboard.

### `/wp-plugin`

Ideally these modifications would ship with Gutenberg in the future but since this is still experimental, this plugin is loaded when viewing the block editor and we register a block so we can handle `raw` transforms. In the future, it would be more ideal to ship this in Gutenberg closer to the [source code](https://github.com/WordPress/gutenberg/tree/1240294d1c81bf50bd9383b7f1973cc16fa13a4a/packages/blocks/src/api/raw-handling).

## How to install this extension on your computer
### Open Chrome Extensions Page:
Open Google Chrome and go to the extensions page by either:

- Typing chrome://extensions/ in the address bar, or
- Clicking the three-dot menu in the top-right corner, selecting "More tools," and then "Extensions."

### Enable Developer Mode:

On the extensions page, toggle the "Developer mode" switch in the top-right corner to enable developer mode. This will allow you to load unpacked extensions.

### Load Unpacked Extension:

Once developer mode is enabled, three new buttons will appear near the top of the page: "Load unpacked," "Pack extension," and "Update."

- Click the "Load unpacked" button.
- In the file dialog that opens, navigate to the directory where your extension files are located and select it.

## Where to paste?

You can visit the options page and it should load WordPress playground with a patched version of gutenberg that will handle the pasting.

### How to view the option page
- Right click on the extension icon
- Select "options"

## Known Issues:

### We can't handle `<ul>/<ol>` with content in it

This won't work:

```html
<ul>
    <li><h2>Something</h2></li>
</ul>    

```

Potential Fix: Write our own transform

### We can't handle `<a>` with content in it

This won't work:

```html
    <a>
        <h2>Something</h2>
        <p>Content</p>
    </a>    

```

Potential Fix: Write our own transform.

### Font styles are not being applied

This is not working even though there is code that makes it seem like it is.

### `<button>` is not converted to block

There isn't a transform for this yet.

### It doesn't do well with responsive design

True.

### It doesn't support SVGs

I think we'll need a block for this.

### Copying can be slow

If there are alot of DOM elements, it can be slow because it's processing everything all at once. Future problem to fix.
