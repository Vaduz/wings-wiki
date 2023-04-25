import { NextApiResponse } from 'next'
import { NextApiRequestReadSpace } from '@/lib/types/nextApiRequest'
import logger from '@/lib/logger/pino'
import { searchDocuments } from '@/lib/elasticsearch/document'
import { DocumentListResponse } from '@/lib/types/apiResponse'
import canReadSpace from '@/lib/middlewares/authenticate/canReadSpace'

export async function handler(req: NextApiRequestReadSpace, res: NextApiResponse<DocumentListResponse>) {
  const { method, body } = req
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
      req: { method: method, query: req.query, body: body, userId: req.token?.userId },
    })
  }
}

export default function withMiddleware(req: NextApiRequestReadSpace, res: NextApiResponse) {
  return new Promise<void>((resolve, reject) => {
    canReadSpace(req, res, () => {
      handler(req, res).then()
      resolve()
    }).then()
  })
}
