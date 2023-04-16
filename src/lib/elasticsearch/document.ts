import { SpaceId, WingsDocument, DocumentId, NewWingsDocument } from '../types/es'
import { randomUUID } from 'crypto'
import client from '@/lib/elasticsearch'

// Document helper functions
export async function createDocument(spaceId: SpaceId, param: NewWingsDocument): Promise<WingsDocument> {
  const documentId = randomUUID()
  const document = {
    ...param,
    created_at: new Date(),
    updated_at: new Date(),
  }
  console.log('ES createDocument:', spaceId, param, document)
  const { result } = await client.create({
    index: getDocumentIndex(spaceId),
    id: documentId,
    document: document,
  })
  if (result != 'created') {
    throw new WingsError(`Invalid createDocument(${spaceId}, ${param}), document: ${document}, result: ${result}`)
  }
  console.log(new Date().toISOString(), ` Document created: ${spaceId}, ${documentId}, ${document.title}`)
  return { ...document, id: documentId }
}

export async function getDocument(spaceId: SpaceId, documentId: DocumentId): Promise<WingsDocument | undefined> {
  const { found, _source } = await client.get({
    index: getDocumentIndex(spaceId),
    id: documentId,
  })
  if (!found || !_source) return
  const document = { ..._source, id: documentId } as WingsDocument
  console.log(new Date().toISOString(), ` Document fetched: ${spaceId}, ${documentId}`, document)
  return document
}

export async function updateDocument(spaceId: SpaceId, document: WingsDocument): Promise<void> {
  console.log(new Date().toISOString(), __filename, ` Document update request: ${spaceId}, `, document)
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
    throw new WingsError(`Invalid updateDocument(${document}) result: ${result}`)
  }
  console.log(new Date().toISOString(), __filename, ` Document updated: ${spaceId}, ${document.id}, ${document.title}`)
}

export async function deleteDocument(spaceId: SpaceId, documentId: DocumentId): Promise<void> {
  const { result } = await client.delete({
    index: getDocumentIndex(spaceId),
    id: documentId,
  })
  if (result != 'deleted') {
    throw new WingsError(`Invalid deleteDocument(${spaceId}, ${documentId}) result: ${result}`)
  }
  console.log(`${new Date().toISOString()} Document deleted: ${spaceId}, ${documentId}`)
}

export function getDocumentIndex(spaceId: SpaceId): string {
  return `document_${spaceId}`
}
