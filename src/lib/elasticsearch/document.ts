import {
  DocumentId,
  EsWingsDocument,
  NewWingsDocument,
  SearchDocumentHit,
  SpaceId,
  WingsDocument,
  WingsDocumentSearchResult,
} from '../types/elasticsearch'
import client from '@/lib/elasticsearch'
import logger from '@/lib/logger/pino'
import { getDocumentIndex } from '@/lib/utils/elasticsearch'
import { ResponseError } from '@elastic/transport/lib/errors'
import { generateDocumentId } from '@/lib/utils/id'

export async function createDocument(spaceId: SpaceId, param: NewWingsDocument): Promise<WingsDocument> {
  const documentId = generateDocumentId()
  const esDocument: EsWingsDocument = {
    ...param,
    created_at: new Date(),
    updated_at: new Date(),
  }
  const { result } = await client.create({
    index: getDocumentIndex(spaceId),
    id: documentId,
    document: esDocument,
  })
  if (result != 'created') {
    throw new WingsError(`Invalid createDocument() result: ${result}, ${spaceId}, ${param}, ${esDocument}`)
  }

  const document: WingsDocument = { ...esDocument, id: documentId }
  logger.debug({ message: 'lib/elasticsearch/document createDocument()', spaceId: spaceId, documentId: documentId })
  // logger.debug({ filename: __filename, document: document })
  return document
}

export async function getDocument(spaceId: SpaceId, documentId: DocumentId): Promise<WingsDocument | undefined> {
  const { found, _source } = await client.get({
    index: getDocumentIndex(spaceId),
    id: documentId,
  })
  if (!found || !_source) return
  const document = { ..._source, id: documentId } as WingsDocument
  logger.debug({ message: 'lib/elasticsearch/document getDocument()', spaceId: spaceId, documentId: documentId })
  // logger.debug({ filename: __filename, document: document })
  return document
}

export async function updateDocument(spaceId: SpaceId, document: WingsDocument): Promise<void> {
  const { result } = await client.update({
    index: getDocumentIndex(spaceId),
    id: document.id,
    doc: {
      title: document.title,
      content: document.content,
      author_id: document.author_id,
      parent_id: document.parent_id,
      mentions: document.mentions,
      tags: document.tags,
      updated_at: new Date(),
    },
  })
  if (result != 'updated') {
    throw new WingsError(`Invalid updateDocument() result: ${result}, document: ${document}`)
  }
  logger.debug({ message: 'lib/elasticsearch/document updateDocument()', spaceId: spaceId, documentId: document.id })
  // logger.debug({ filename: __filename, document: document })
}

export async function deleteDocument(spaceId: SpaceId, documentId: DocumentId): Promise<void> {
  const { result } = await client.delete({
    index: getDocumentIndex(spaceId),
    id: documentId,
  })
  if (result != 'deleted') {
    throw new WingsError(`Invalid deleteDocument() result: ${result}, ${spaceId}, ${documentId}`)
  }
  logger.debug({ message: 'lib/elasticsearch/document deleteDocument()', spaceId: spaceId, documentId: documentId })
}

export async function getLatestDocuments(spaceId: SpaceId, size: number): Promise<WingsDocument[]> {
  try {
    const response = await client.search<EsWingsDocument>({
      index: getDocumentIndex(spaceId),
      size: size,
      sort: [
        {
          updated_at: {
            order: 'desc',
          },
        },
      ],
      _source: {
        excludes: ['content'],
      },
    })
    logger.debug({ message: 'getLatestDocuments', spaceId: spaceId, response: response })
    const hits = response.hits.hits
    if (!hits) return []
    const documents: WingsDocument[] = []
    hits.forEach((hit) => {
      documents.push({
        ...hit._source,
        id: hit._id,
      } as WingsDocument)
    })
    return documents
  } catch (e) {
    const err = e as ResponseError
    if (err.meta.statusCode !== 404) {
      logger.error({ message: 'getLatestDocuments', spaceId: spaceId, error: e })
    }
    return [] as WingsDocument[]
  }
}

export async function searchDocuments(spaceId: SpaceId, q: string): Promise<SearchDocumentHit[]> {
  try {
    const response = await client.search<EsWingsDocument>({
      index: getDocumentIndex(spaceId),
      size: 20,
      query: {
        multi_match: {
          query: q,
          fields: ['tag^3', 'title^2', 'content'],
        },
      },
      _source: {
        excludes: ['content'],
      },
      highlight: {
        fields: {
          title: {
            fragment_size: 100,
            number_of_fragments: 1,
          },
          content: {
            fragment_size: 100,
            number_of_fragments: 1,
          },
        },
      },
      from: 0,
    })
    logger.debug({ message: 'searchDocuments', spaceId: spaceId, q: q, response: response })
    const hits = response.hits.hits
    if (!hits) return []
    const searchResults: SearchDocumentHit[] = []
    hits.forEach((hit) => {
      const content = hit.highlight && hit.highlight.content ? hit.highlight.content : undefined
      searchResults.push({
        document: {
          ...hit._source,
          id: hit._id,
        } as WingsDocumentSearchResult,
        highlight: content && { content: content },
      } as SearchDocumentHit)
    })
    return searchResults
  } catch (e) {
    logger.error({ message: 'searchDocuments', spaceId: spaceId, q: q, error: e })
    return []
  }
}

export async function childDocuments(spaceId: SpaceId, parentId: DocumentId): Promise<WingsDocumentSearchResult[]> {
  try {
    const response = await client.search<EsWingsDocument>({
      index: getDocumentIndex(spaceId),
      size: 100,
      query: {
        match: {
          parent_id: parentId,
        },
      },
      _source: {
        excludes: ['content'],
      },
    })
    logger.debug({ message: 'childDocuments', spaceId: spaceId, parentId: parentId, response: response })
    const hits = response.hits.hits
    if (!hits) return []
    const childDocuments: WingsDocumentSearchResult[] = []
    hits.forEach((hit) => {
      childDocuments.push({
        ...hit._source,
        id: hit._id,
      } as WingsDocumentSearchResult)
    })
    return childDocuments
  } catch (e) {
    logger.error({ message: 'childDocuments', spaceId: spaceId, parentId: parentId, error: e })
    return []
  }
}
