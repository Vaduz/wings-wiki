import client from '../clients/elasticsearch'
import { User, UserId, Space, SpaceId, Document, DocumentId } from '../types/es'
import { randomUUID } from 'crypto'

// User helper functions
export async function createUser(user: User): Promise<User> {
  user.id = randomUUID()
  const { result } = await client.create({
    index: 'user',
    id: user.id,
    document: user,
  })
  if (result != 'created') {
    throw new WingsError(`Invalid createUser(${user}) result: ${result}`)
  }
  console.log(new Date().toISOString(), ` User created: ${user.id}, ${user.name}`)
  return user
}

export async function getUser(userId: UserId): Promise<User | undefined> {
  const { found, _source } = await client.get({
    index: 'user',
    id: userId,
  })
  if (!found || !_source) return
  const user = _source as User
  console.log(new Date().toISOString(), ` User fetched: ${userId}, ${user.name}`)
  return user
}

export async function updateUser(user: User): Promise<void> {
  const { result } = await client.update({
    index: 'user',
    id: user.id,
    doc: {
      doc: document,
    },
  })

  if (result != 'updated') {
    throw new WingsError(`Invalid updateUser(${user}) result: ${result}`)
  } else {
    console.log(new Date().toISOString(), ` User updated: ${user.id}, ${user.name}`)
  }
}

// Space helper functions
export async function createSpace(space: Space): Promise<Space> {
  const { result } = await client.create({
    index: 'space',
    id: space.id,
    document: space,
  })
  if (result != 'created') {
    throw new WingsError(`Invalid createSpace(${space}) result: ${result}`)
  }
  console.log(new Date().toISOString(), ` Space created: ${space.id}, ${space.name}`)
  return space
}

export async function getSpace(spaceId: SpaceId): Promise<Space | undefined> {
  const { found, _source } = await client.get({
    index: 'space',
    id: spaceId,
  })
  if (!found || !_source) return
  const space = _source as Space
  console.log(new Date().toISOString(), ` Space fetched: ${spaceId}, ${space.name}`)
  return space
}

export async function updateSpace(space: Space): Promise<void> {
  const { result } = await client.update({
    index: 'space',
    id: space.id,
    doc: {
      doc: document,
    },
  })
  if (result != 'updated') {
    throw new WingsError(`Invalid updateSpace(${space}) result: ${result}`)
  }
  console.log(`${new Date().toISOString()} Space updated: ${space}`)
}

// Document helper functions
export async function createDocument(spaceId: SpaceId, document: Document): Promise<Document> {
  const documentId = randomUUID()
  document.id = documentId
  const { result } = await client.create({
    index: getDocumentIndex(spaceId),
    id: documentId,
    document: document,
  })
  if (result != 'created') {
    throw new WingsError(`Invalid createDocument(${document}) result: ${result}`)
  }
  console.log(new Date().toISOString(), ` Document created: ${spaceId}, ${document.id}, ${document.title}`)
  return document
}

export async function getDocument(spaceId: SpaceId, documentId: DocumentId): Promise<Document | undefined> {
  const { found, _source } = await client.get({
    index: getDocumentIndex(spaceId),
    id: documentId,
  })
  if (!found || !_source) return
  console.log(new Date().toISOString(), ` Document fetched: ${spaceId}, ${documentId}`)
  return _source as Document
}

export async function updateDocument(spaceId: SpaceId, document: Document): Promise<void> {
  const { result } = await client.update({
    index: getDocumentIndex(spaceId),
    id: document.id,
    doc: {
      doc: document,
    },
  })
  if (result != 'updated') {
    throw new WingsError(`Invalid updateDocument(${document}) result: ${result}`)
  }
  console.log(`${new Date().toISOString()} Document updated: ${spaceId}, ${document.id}, ${document.title}`)
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
