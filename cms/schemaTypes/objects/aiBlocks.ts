import {defineField, defineType} from 'sanity'

export const promptBlock = defineType({
  name: 'promptBlock',
  title: 'Prompt',
  type: 'object',
  fields: [
    defineField({
      name: 'text',
      title: 'Prompt',
      type: 'text',
      rows: 5,
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'label', title: 'Label', type: 'string', initialValue: 'Prompt'}),
    defineField({name: 'note', title: 'Note', type: 'string', description: 'e.g. "Pass 1 of 4"'}),
  ],
  preview: {
    select: {title: 'text', subtitle: 'note'},
  },
})

export const iterations = defineType({
  name: 'iterations',
  title: 'Iterations',
  type: 'object',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({
      name: 'items',
      title: 'Versions',
      type: 'array',
      validation: (Rule) => Rule.min(2),
      of: [
        {
          type: 'object',
          name: 'iteration',
          fields: [
            {
              name: 'image',
              title: 'Image',
              type: 'imageBlock',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'e.g. V1',
              validation: (Rule) => Rule.required(),
            },
            {name: 'caption', title: 'Caption', type: 'string'},
            {name: 'kept', title: 'Kept', type: 'boolean', initialValue: false},
          ],
          preview: {
            select: {title: 'label', subtitle: 'caption', media: 'image'},
          },
        },
      ],
    }),
  ],
  preview: {
    select: {title: 'title'},
    prepare: ({title}) => ({title: title || 'Iterations'}),
  },
})

export const pullQuote = defineType({
  name: 'pullQuote',
  title: 'Pull quote',
  type: 'object',
  fields: [
    defineField({
      name: 'text',
      title: 'Text',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {select: {title: 'text'}},
})

export const figureRow = defineType({
  name: 'figureRow',
  title: 'Figure row',
  type: 'object',
  fields: [
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{type: 'imageBlock'}],
      validation: (Rule) => Rule.min(2).max(3),
    }),
  ],
  preview: {
    select: {media: 'images.0'},
    prepare: ({media}) => ({title: 'Figure row', media}),
  },
})

export const ctaLink = defineType({
  name: 'ctaLink',
  title: 'Call to action',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'href',
      title: 'URL',
      type: 'string',
      validation: (Rule) => Rule.required().uri({allowRelative: true, scheme: ['http', 'https']}),
    }),
  ],
  preview: {select: {title: 'label', subtitle: 'href'}},
})
