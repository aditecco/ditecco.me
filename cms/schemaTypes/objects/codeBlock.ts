import {defineType} from 'sanity'

export default defineType({
  name: 'codeBlock',
  title: 'Code Block',
  type: 'object',
  fields: [
    {
      name: 'language',
      title: 'Language',
      type: 'string',
      options: {
        list: [
          {title: 'JavaScript', value: 'javascript'},
          {title: 'TypeScript', value: 'typescript'},
          {title: 'HTML', value: 'html'},
          {title: 'CSS', value: 'css'},
          {title: 'SCSS', value: 'scss'},
          {title: 'JSON', value: 'json'},
          {title: 'Bash', value: 'bash'},
          {title: 'Python', value: 'python'},
        ],
      },
      initialValue: 'javascript',
    },
    {
      name: 'code',
      title: 'Code',
      type: 'text',
      rows: 10,
    },
    {
      name: 'filename',
      title: 'Filename',
      type: 'string',
    },
  ],
})
