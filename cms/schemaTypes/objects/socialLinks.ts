import {defineType} from 'sanity'

export default defineType({
  name: 'socialLinks',
  title: 'Social Links',
  type: 'object',
  fields: [
    {
      name: 'twitter',
      type: 'url',
      title: 'Twitter',
    },
    {
      name: 'linkedin',
      type: 'url',
      title: 'LinkedIn',
    },
    {
      name: 'github',
      type: 'url',
      title: 'GitHub',
    },
  ],
})
