
Readme
======

## General notes and reminders about this project


### `jekyll-pug` and Liquid tags

- When using Liquid tags inside pug templates, remember that if a tag is _not preceded_ by a pug element tag, it will require a leading pipe:

```pug

//- regular tag
small {% include dtc-common-footer %}

//- pipe required
.blog-post-body.container
  | {{ content }}
```


### `jekyll-pug` and includes

- When an include is required in pug layouts, the compiler will assume a `.pug` extension if no ext. is specified.
- If we need to include a plain old `.html` include, we have to specify its ext:

```liquid

{% include example.html %}
```
