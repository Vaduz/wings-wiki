import { NextApiRequest, NextApiResponse } from 'next'
import { WingsDocument, DocumentId, UserId } from '@/lib/types/es'
import { createDocument, getDocument, updateDocument, deleteDocument } from '@/lib/elasticsearch/document'
import logger from '@/lib/logger/pino'
import authenticate from '@/lib/middlewares/authenticate'
import { getSpace } from '@/lib/elasticsearch/space'

type DocumentResponse = {
  data?: WingsDocument
  error?: unknown
}

const secret = process.env.JWT_SECRET

export async function handler(req: NextApiRequest, res: NextApiResponse<DocumentResponse>) {
  const { method, body } = req
  const spaceId = req.query.spaceId as string
  const documentId = req.query.documentId as string

  try {
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

    switch (method) {
      case 'GET':
        const fetchedDocument = await getDocument(spaceId, documentId)
        if (!fetchedDocument) {
          res.status(404).json({ error: `${documentId} not found` })
        } else {
          res.status(200).json({ data: fetchedDocument })
        }
        break

      case 'POST':
        const newDocument: WingsDocument = await createDocument(spaceId, body)
        res.status(200).json({ data: newDocument })
        break

      case 'PUT':
        await updateDocument(spaceId, body)
        res.status(200).json({ data: body })
        break

      case 'DELETE':
        const target = await getDocument(spaceId, documentId)
        if (!target) {
          logger.warn({ message: 'Target document not found', spaceId: spaceId, documentId: documentId })
          res.status(400).json({ data: undefined })
          break
        }

        if (target.author_id != userId) {
          logger.warn({
            message: `Unauthenticated or not an owner`,
            author_id: target.author_id,
            token: req.token,
          })
          res.status(400).json({ data: undefined })
          break
        }

        await deleteDocument(spaceId, documentId)
        res.status(200).json({ data: undefined })
        break

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
  } catch (e) {
    res.status(500).json({ error: e })
    logger.error(e)
  } finally {
    logger.info({
      message: 'pages/api/document.ts finally',
      path: '/api/document',
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
