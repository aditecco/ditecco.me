import author from './documents/author'
import blogPost from './documents/blogPost'
import blogTag from './taxonomies/blogTag'
import portableText from './objects/portableText'
import socialLinks from './objects/socialLinks'
import codeBlock from './objects/codeBlock'
import imageBlock from './objects/imageBlock'

export const schemaTypes = [
  // Documents
  author,
  blogPost,

  // Taxonomies
  blogTag,

  // Objects
  portableText,
  socialLinks,
  codeBlock,
  imageBlock,
]
