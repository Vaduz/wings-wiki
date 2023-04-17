import { SpaceId, WingsDocument, DocumentId, NewWingsDocument } from '../types/es'
import { randomUUID } from 'crypto'
import client from '@/lib/elasticsearch'
import logger from '@/lib/logger/pino'

export async function createDocument(spaceId: SpaceId, param: NewWingsDocument): Promise<WingsDocument> {
  const documentId = randomUUID()
  const esDocument = {
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
      mentions: document.mentions,
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

export function getDocumentIndex(spaceId: SpaceId): string {
  return `document_${spaceId}`
}
