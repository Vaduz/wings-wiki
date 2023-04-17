import { NewSpace, Space, SpaceId } from '../types/es'
import client from '@/lib/elasticsearch'
import logger from '@/lib/logger/pino'
import { randomUUID } from 'crypto'

export async function createSpace(param: NewSpace): Promise<Space> {
  const spaceId: SpaceId = randomUUID()
  const document = {
    ...param,
    created_at: new Date(),
    updated_at: new Date(),
  }
  const { result } = await client.create({
    index: 'space',
    id: spaceId,
    document: document,
  })
  if (result != 'created') {
    throw new WingsError(`Invalid createSpace() result: ${result}, ${param}, ${spaceId}`)
  }

  const space: Space = { ...document, id: spaceId }
  logger.debug({ message: 'lib/elasticsearch/space createSpace()', spaceId: spaceId })
  // logger.debug({ filename: __filename, space: space })
  return space
}

export async function getSpace(spaceId: SpaceId): Promise<Space | undefined> {
  const { found, _source } = await client.get({
    index: 'space',
    id: spaceId,
  })
  if (!found || !_source) return
  const space: Space = { ..._source, id: spaceId } as Space
  logger.debug({ message: 'lib/elasticsearch/space getSpace()', spaceId: space.id })
  // logger.debug({ filename: __filename, space: space })
  return space
}

export async function updateSpace(space: Space): Promise<void> {
  const { result } = await client.update({
    index: 'space',
    id: space.id,
    doc: {
      name: space.name,
      description: space.description,
      members: space.members,
      updated_at: new Date(),
    },
  })
  if (result != 'updated') {
    throw new WingsError(`Invalid updateSpace() result: ${result}, ${space}`)
  }
  logger.debug({ message: 'lib/elasticsearch/space updateSpace()', spaceId: space.id })
  // logger.debug({ filename: __filename, space: space })
}
