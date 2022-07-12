# \<livestate-comments>

This is custom element for an example project for [live_state](https://github.com/gaslight/live_state). It adds
a comment section to a website.

## Usage

Easiest way is to add it to your page via a script tag using unpkg:

```html
<script type="module" src="https://unpkg.com/livestate-comments"></script>
```

Then, you can use it in your page wherever you like:

```html
<livestate-comments url="wss://livestate-comments.herokuapp.com/socket"></livestate-comments>
```

Poof! A magical comments section should appear. It serves the same comments on all pages just now. It's likely they'll be deleted periodically, but feel free to play around!
