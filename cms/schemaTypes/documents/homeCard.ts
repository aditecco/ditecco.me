import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'homeCard',
  title: 'Home Card',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
    }),
    defineField({
      name: 'href',
      title: 'Link',
      type: 'string',
      description: 'Internal path (/resume/) or full URL',
    }),
    defineField({
      name: 'master',
      title: 'Master card',
      type: 'boolean',
      description: 'The intro card: tall, with greeting and body text',
      initialValue: false,
    }),
    defineField({
      name: 'expanded',
      title: 'Expanded',
      type: 'boolean',
      description: 'Spans two rows and shows the hero image',
      initialValue: false,
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'intro',
      title: 'Intro (master card only)',
      type: 'portableText',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
    }),
    defineField({
      name: 'heroImg',
      title: 'Hero image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'heroAlt',
      title: 'Hero image alt text',
      type: 'string',
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      validation: (Rule) => Rule.required().integer().min(1),
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'subtitle', media: 'heroImg'},
  },
  orderings: [{title: 'Order', name: 'order', by: [{field: 'order', direction: 'asc'}]}],
})
