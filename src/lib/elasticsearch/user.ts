import { User, UserId } from '../types/es'
import { randomUUID } from 'crypto'
import client from '@/lib/elasticsearch'

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
