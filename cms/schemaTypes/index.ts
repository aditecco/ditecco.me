import author from './documents/author'
import note from './documents/note'
import resumeEntry from './documents/resumeEntry'
import homeCard from './documents/homeCard'
import noteTag from './taxonomies/noteTag'
import portableText from './objects/portableText'
import socialLinks from './objects/socialLinks'
import codeBlock from './objects/codeBlock'
import imageBlock from './objects/imageBlock'

export const schemaTypes = [
  // Documents
  author,
  note,
  resumeEntry,
  homeCard,

  // Taxonomies
  noteTag,

  // Objects
  portableText,
  socialLinks,
  codeBlock,
  imageBlock,
]
