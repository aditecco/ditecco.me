import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'aiMedium',
  title: 'AI Creation Medium',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'Used in the index filter URL: /ai-creations/all/?medium=slug',
      options: {source: 'title', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {select: {title: 'title', subtitle: 'slug.current'}},
})
