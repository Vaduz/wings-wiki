import { NextApiResponse } from 'next'
import { NextApiRequestWithTokenAndSpace } from '@/lib/types/nextApi'
import logger from '@/lib/logger/pino'
import { searchDocuments } from '@/lib/elasticsearch/document'
import { DocumentListResponse } from '@/lib/types/apiResponse'
import spaceAuthenticate from '@/lib/middlewares/spaceAuthenticate'
import tokenAuthenticate from '@/lib/middlewares/tokenAuthenticate'
import { UserId } from '@/lib/types/es'

export async function handler(req: NextApiRequestWithTokenAndSpace, res: NextApiResponse<DocumentListResponse>) {
  const { method, body } = req
  const userId = req.token.userId as UserId
  const spaceId = req.query.spaceId as string
  const q = req.query.q as string

  if (!method || method != 'POST') {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${method} Not Allowed`)
    return
  }

  try {
    const searchResults = await searchDocuments(spaceId, q)
    res.status(200).json({ data: searchResults })
    logger.debug({ message: 'Fetched documents', documents: searchResults })
  } catch (e) {
    res.status(500).json({ error: e })
    logger.error(e)
  } finally {
    logger.info({
      path: '/api/document/search',
      status: res.statusCode,
      req: { method: method, query: req.query, body: body, userId: userId },
    })
  }
}

export default function withMiddleware(req: NextApiRequestWithTokenAndSpace, res: NextApiResponse) {
  return new Promise<void>((resolve, reject) => {
    tokenAuthenticate(req, res, () => {
      spaceAuthenticate(req, res, () => {
        handler(req, res).then()
        resolve()
      }).then()
    }).then()
  })
}
