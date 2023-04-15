import fs from 'fs'
import path from 'path'
import { Client } from '@elastic/elasticsearch'
import { randomUUID } from 'crypto'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const client = new Client({
  node: process.env.ES_API_URL ?? 'http://localhost:9200',
})

async function createIndex(indexName: string, schemaPath: string) {
  const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'))
  await client.indices.create({
    index: indexName,
    mappings: schema,
  })
}

async function createAdminAndSpace(adminEmail: string) {
  const adminUserId = randomUUID()
  const spaceId = randomUUID()
  await client.create({
    index: 'user',
    id: adminUserId,
    document: {
      email: adminEmail,
      name: 'Admin',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  })

  await client.create({
    index: 'space',
    id: spaceId,
    document: {
      name: 'Initial space',
      owner_id: adminUserId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  })

  return { adminUserId, spaceId }
}

async function createInitialDocument(spaceId: string, adminUserId: string) {
  const documentIndexName = `document_${spaceId}`
  const schemaPath = path.join(dirname(fileURLToPath(import.meta.url)), './schema/document.json')
  await createIndex(documentIndexName, schemaPath)

  await client.create({
    index: documentIndexName,
    id: randomUUID(),
    document: {
      title: 'Hello Wings Wiki!',
      content: 'This is the initial document created by the admin user.',
      author_id: adminUserId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      parent_id: null,
    },
  })
}

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL
  if (!adminEmail) {
    console.error('ADMIN_EMAIL environment variable is not set.')
    process.exit(1)
  }

  // Create user and space indices
  await createIndex('user', path.join(dirname(fileURLToPath(import.meta.url)), './schema/user.json'))
  await createIndex('space', path.join(dirname(fileURLToPath(import.meta.url)), './schema/space.json'))

  // Create admin user and initial space
  const { adminUserId, spaceId } = await createAdminAndSpace(adminEmail)

  // Create initial document index and document
  await createInitialDocument(spaceId, adminUserId)
}

main()
  .then(() => {
    console.log('Initialization completed successfully.')
  })
  .catch((error) => {
    console.error('An error occurred during initialization:', error)
  })
