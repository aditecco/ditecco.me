import author from './documents/author'
import note from './documents/note'
import resumeEntry from './documents/resumeEntry'
import homeCard from './documents/homeCard'
import aiCreation from './documents/aiCreation'
import noteTag from './taxonomies/noteTag'
import aiTag from './taxonomies/aiTag'
import portableText from './objects/portableText'
import socialLinks from './objects/socialLinks'
import codeBlock from './objects/codeBlock'
import imageBlock from './objects/imageBlock'
import aiPortableText from './objects/aiPortableText'
import {ctaLink, figureRow, iterations, promptBlock, pullQuote} from './objects/aiBlocks'

export const schemaTypes = [
  // Documents
  author,
  note,
  resumeEntry,
  homeCard,
  aiCreation,

  // Taxonomies
  noteTag,
  aiTag,

  // Objects
  portableText,
  socialLinks,
  codeBlock,
  imageBlock,
  aiPortableText,
  promptBlock,
  iterations,
  pullQuote,
  figureRow,
  ctaLink,
]
