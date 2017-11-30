
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
