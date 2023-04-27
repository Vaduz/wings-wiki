import { SpaceId } from '@/lib/types/elasticsearch'
import client from '@/lib/elasticsearch/client'
import { getDocumentIndex } from '@/lib/utils/elasticsearch'

export async function createIndex(spaceId: SpaceId): Promise<boolean> {
  const { acknowledged } = await client.indices.create({
    index: getDocumentIndex(spaceId),
    settings: {
      analysis: {
        tokenizer: {
          kuromoji_tokenizer: {
            type: 'kuromoji_tokenizer',
            mode: 'normal',
          },
        },
        analyzer: {
          kuromoji_analyzer: {
            type: 'custom',
            tokenizer: 'kuromoji_tokenizer',
          },
        },
      },
    },
    mappings: {
      properties: {
        title: {
          type: 'text',
          analyzer: 'kuromoji_analyzer',
        },
        content: {
          type: 'text',
          analyzer: 'kuromoji_analyzer',
        },
        content_plain: {
          type: 'text',
          analyzer: 'kuromoji_analyzer',
        },
      },
    },
  })

  return acknowledged
}
