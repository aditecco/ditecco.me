import {defineField, defineType} from 'sanity'

// routes under /ai-creations/ that a slug must not shadow
const RESERVED_SLUGS = ['all']

export default defineType({
  name: 'aiCreation',
  title: 'AI Creation',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (Rule) =>
        Rule.required().custom((slug) =>
          slug?.current && RESERVED_SLUGS.includes(slug.current)
            ? `"${slug.current}" is reserved`
            : true,
        ),
    }),
    defineField({
      name: 'medium',
      title: 'Medium',
      type: 'reference',
      to: [{type: 'aiMedium'}],
      description: 'The category the index page filters by',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'mediumDetail',
      title: 'Medium, in full',
      type: 'string',
      description: 'Shown on the detail page, e.g. "Code, real-time graphics"',
    }),
    defineField({
      name: 'tools',
      title: 'Tools',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published date',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 2,
      description: 'One line for the index',
      validation: (Rule) => Rule.required().max(160),
    }),
    defineField({
      name: 'lede',
      title: 'Lede',
      type: 'text',
      rows: 3,
      description: 'The italic intro under the title',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'imageBlock',
      description: 'Index thumbnail, cropped to 10:7',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      type: 'imageBlock',
      description: 'Detail page, cropped to 16:9',
    }),
    defineField({
      name: 'credits',
      title: 'Credits',
      type: 'array',
      description: 'Who did what, e.g. Human / Machine',
      of: [
        {
          type: 'object',
          name: 'credit',
          fields: [
            {name: 'role', title: 'Role', type: 'string', validation: (Rule) => Rule.required()},
            {
              name: 'contribution',
              title: 'Contribution',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {select: {title: 'role', subtitle: 'contribution'}},
        },
      ],
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'aiPortableText',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'medium.title', media: 'coverImage'},
  },
  orderings: [
    {
      title: 'Published Date, New',
      name: 'publishedDateDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
  ],
})
