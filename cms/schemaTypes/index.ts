import author from './documents/author'
import blogPost from './documents/blogPost'
import blogTag from './taxonomies/blogTag'
import portableText from './objects/portableText'

export const schemaTypes = [
  // Documents
  author,
  blogPost,

  // Taxonomies
  blogTag,

  // Objects
  portableText,
]
