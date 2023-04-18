import { NextApiRequest, NextApiResponse } from 'next'
import authenticate from '@/lib/middlewares/authenticate'
import { Space, UserId, WingsDocument } from '@/lib/types/es'
import logger from '@/lib/logger/pino'
import { getSpace } from '@/lib/elasticsearch/space'
import { searchDocuments } from '@/lib/elasticsearch/document'
import { DocumentsAndSpace } from '@/lib/types/wings'

type DocumentListResponse = {
  data?: DocumentsAndSpace
  error?: unknown
}

export async function handler(req: NextApiRequest, res: NextApiResponse<DocumentListResponse>) {
  const { method, body } = req
  const spaceId = req.query.spaceId as string
  if (!spaceId) {
    res.status(400).json({ data: undefined })
    return
  }

  try {
    if (method != 'POST') {
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
      return
    }

    if (!req.token) {
      logger.warn({ message: 'token not found' })
      res.status(400).json({ data: undefined })
      return
    }
    const userId = req.token.userId as UserId

    const space = await getSpace(spaceId)
    if (!space) {
      logger.warn({ message: 'Space not found', spaceId: spaceId })
      res.status(400).json({ data: undefined })
      return
    }

    if (!space.members.includes(userId)) {
      logger.warn({ message: 'Space not found', spaceId: spaceId })
      res.status(400).json({ data: undefined })
      return
    }

    const documents = await searchDocuments(spaceId)
    res.status(200).json({ data: { space: space, documents: documents } })
    logger.debug({ message: 'Fetched documents', documents: documents })
  } catch (e) {
    res.status(500).json({ error: e })
    logger.error(e)
  } finally {
    logger.info({
      message: 'pages/api/document/search.ts finally',
      path: '/api/document/search',
      req: { method: method, query: req.query, body: body },
      res: { status: res.statusCode },
      userId: req.token?.userId,
    })
  }
}

export default function withMiddleware(req: NextApiRequest, res: NextApiResponse) {
  return new Promise<void>((resolve, reject) => {
    authenticate(req, res, () => {
      handler(req, res).then()
      resolve()
    }).then()
  })
}
