import { NewUser, User, UserId } from '../types/es'
import { randomUUID } from 'crypto'
import client from '@/lib/elasticsearch'
import logger from '@/lib/logger/pino'

export async function createUser(param: NewUser): Promise<User> {
  const userId: UserId = randomUUID()
  const { result } = await client.create({
    index: 'user',
    id: userId,
    document: param,
  })
  if (result != 'created') {
    throw new WingsError(`Invalid createUser() result: ${result}, ${param}`)
  }

  const user: User = { ...param, id: userId } as User
  logger.info({ message: 'lib/elasticsearch/user createUser()', userId: userId })
  logger.debug({ filename: __filename, user: user })
  return user
}

export async function getUser(userId: UserId): Promise<User | undefined> {
  const { found, _source } = await client.get({
    index: 'user',
    id: userId,
  })
  if (!found || !_source) return

  const user: User = { ..._source, id: userId } as User
  logger.info({ message: 'lib/elasticsearch/user getUser()', userId: userId })
  logger.debug({ filename: __filename, user: user })
  return user
}

export async function updateUser(user: User): Promise<void> {
  const { result } = await client.update({
    index: 'user',
    id: user.id,
    doc: {
      email: user.email,
      name: user.name,
      avatar_url: user.avatar_url,
      updated_at: new Date(),
    },
  })
  if (result != 'updated') {
    throw new WingsError(`Invalid updateUser() result: ${result}, user: ${user}`)
  }

  logger.info({ message: 'lib/elasticsearch/user getUser()', userId: user.id })
  logger.debug({ filename: __filename, user: user })
}
