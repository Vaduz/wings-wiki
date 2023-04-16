import { Space, SpaceId } from '../types/es'
import client from '@/lib/elasticsearch'

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
