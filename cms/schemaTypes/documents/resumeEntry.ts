import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'resumeEntry',
  title: 'Resume Entry',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'e.g. "2023 - Present — Caffeina"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
    }),
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      options: {
        list: [
          {title: 'English', value: 'EN'},
          {title: 'Italian', value: 'IT'},
        ],
        layout: 'radio',
      },
      initialValue: 'EN',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Work experience', value: 'work'},
          {title: 'Other experiences', value: 'other'},
        ],
        layout: 'radio',
      },
      initialValue: 'work',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Lower numbers come first (1 is the current position)',
      validation: (Rule) => Rule.required().integer().min(1),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'portableText',
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'subtitle', language: 'language'},
    prepare({title, subtitle, language}) {
      return {title, subtitle: `${language} • ${subtitle ?? ''}`}
    },
  },
  orderings: [
    {
      title: 'Language, then order',
      name: 'languageOrder',
      by: [
        {field: 'language', direction: 'asc'},
        {field: 'order', direction: 'asc'},
      ],
    },
  ],
})
