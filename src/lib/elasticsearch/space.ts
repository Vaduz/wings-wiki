import { NewSpace, Space, SpaceId, UserId } from '../types/es'
import client from '@/lib/elasticsearch'
import logger from '@/lib/logger/pino'
import { generateSpaceId } from '@/lib/utils/id'

export async function createSpace(param: NewSpace): Promise<Space> {
  const spaceId: SpaceId = generateSpaceId()
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

export async function getUserSpaces(userId: UserId): Promise<Space[]> {
  try {
    const response = await client.search<Space>({
      index: 'space',
      query: {
        bool: {
          should: [
            {
              term: { 'members.keyword': userId },
            },
            {
              term: { owner_id: userId },
            },
          ],
          minimum_should_match: 1,
        },
      },
    })
    logger.debug({ message: 'getUserSpaces', response: response })
    const hits = response.hits.hits
    if (!hits) return []
    const spaces: Space[] = []
    hits.forEach((hit) => {
      spaces.push({
        ...hit._source,
        id: hit._id,
      } as Space)
    })
    return spaces
  } catch (e) {
    logger.error({ message: 'getUserSpaces', userId: userId, error: e })
    return []
  }
}
