import {defineArrayMember, defineType} from 'sanity'
import portableText from './portableText'

// the notes' block config, with headings limited to what the template styles
const [block] = portableText.of

export default defineType({
  name: 'aiPortableText',
  title: 'AI Creation body',
  type: 'array',
  of: [
    defineArrayMember({
      ...block,
      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'Heading', value: 'h2'},
        {title: 'Subheading', value: 'h3'},
      ],
    } as typeof block),
    defineArrayMember({type: 'imageBlock'}),
    defineArrayMember({type: 'promptBlock'}),
    defineArrayMember({type: 'iterations'}),
    defineArrayMember({type: 'pullQuote'}),
    defineArrayMember({type: 'figureRow'}),
    defineArrayMember({type: 'ctaLink'}),
  ],
})
