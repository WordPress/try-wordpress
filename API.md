## Models

### Blueprint
TBD

### Header

```
{
	type:      'header';
	id:        number;
	sourceUrl: string; // URL of the original page from which the header was created.
	// More fields TBD.
}
```
### Footer

```
{
	type:      'footer';
	id:        number;  
	sourceUrl: string; // URL of the original page from which the footer was created.
	// More fields TBD.
}
```
### BlogPost

```
{
	type:          'blog-post';
	id:            number;  
	transformedId: number;      // Id of the corresponding transformed post
	sourceUrl:     string;      // URL of the source page from which this blog post was created.
	date: {
		type:     'date';
	    original: string; // original HTML
	    parsed:   string; // ISO date string
	},
	title: {
		type:     'text';
	    original: string; // original HTML
	    parsed:   string; // plain text
	},
	content: {
		type:     'html';
	    original: string; // original HTML
	    parsed:   string; // block markup
	}
}
```

## Subjects API

These would work the same for any kind of subject, e.g. `blog-post`, `header`, or `footer`.

### `create`

**Request body**:

```
{
	type: 'header' | 'footer' | 'blog-post' | ...;
	sourceUrl: string;
}
```

**Response body**:
Corresponding subject model, as defined in [Models](#models).

### `update`

**Request body**:
Only the fields that should be updated, as defined in [Models](#models), for the corresponding subject.

**Response body**:
corresponding subject model, as defined in [Models](#models).

### `findById`

**Request body**:

```
{
	id: number;
}
```

**Response body**:
corresponding subject model, as defined in [Models](#models).

### `findBySourceUrl`

**Request body**:

```
{
	sourceUrl: string;
}
```

**Response body**:
corresponding subject model, as defined in [Models](#models).

## Blueprints API

TBD
