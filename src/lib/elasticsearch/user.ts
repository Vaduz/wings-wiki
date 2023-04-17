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
  logger.debug({ message: 'lib/elasticsearch/user createUser()', userId: userId })
  // logger.debug({ filename: __filename, user: user })
  return user
}

export async function getUser(userId: UserId): Promise<User | undefined> {
  const { found, _source } = await client.get({
    index: 'user',
    id: userId,
  })
  if (!found || !_source) return

  const user: User = { ..._source, id: userId } as User
  logger.debug({ message: 'lib/elasticsearch/user getUser()', userId: userId })
  // logger.debug({ filename: __filename, user: user })
  return user
}

export async function updateUser(user: User): Promise<void> {
  const { result } = await client.update({
    index: 'user',
    id: user.id,
    doc: {
      oauth_provider: user.oauth_provider,
      oauth_id: user.oauth_id,
      email: user.email,
      name: user.name,
      avatar_url: user.avatar_url,
      updated_at: new Date(),
    },
  })
  if (result != 'updated') {
    throw new WingsError(`Invalid updateUser() result: ${result}, user: ${user}`)
  }

  logger.debug({ message: 'lib/elasticsearch/user getUser()', userId: user.id })
  // logger.debug({ filename: __filename, user: user })
}

async function exactMatchSearch(terms: Map<string, string>): Promise<User | undefined> {
  const filter: Array<{ term: { [key: string]: string } }> = []
  terms.forEach((value, key) => {
    filter.push({ term: { [key]: value } })
  })
  logger.debug({ message: 'exactMatchSearch', filter: filter })

  try {
    const response = await client.search<User>({
      index: 'user',
      query: {
        bool: {
          filter: filter,
        },
      },
    })
    logger.debug({ message: 'exactMatchSearch', response: response })
    const hit = response.hits.hits.at(0)
    if (!hit || !hit._source) return
    return { ...hit._source, id: hit._id }
  } catch (e) {
    logger.error({ message: 'exactMatchSearch', terms: terms, error: e })
  }
}

export async function findUserByProvider(provider: OauthProvider, sub: string): Promise<User | undefined> {
  return exactMatchSearch(
    new Map<string, string>([
      ['oauth_provider', provider],
      ['oauth_id', sub],
    ])
  )
}

export async function findUserByEmail(email: string): Promise<User | undefined> {
  return exactMatchSearch(new Map<string, string>([['email', email]]))
}
