import { NextApiResponse } from 'next'
import { NextApiRequestWithTokenAndSpace } from '@/lib/types/nextApi'
import { UserId, WingsDocument } from '@/lib/types/es'
import { createDocument, deleteDocument, getDocument, updateDocument } from '@/lib/elasticsearch/document'
import logger from '@/lib/logger/pino'
import spaceAuthenticate from '@/lib/middlewares/spaceAuthenticate'
import tokenAuthenticate from '@/lib/middlewares/tokenAuthenticate'
import { DocumentResponse } from '@/lib/types/apiResponse'

const secret = process.env.JWT_SECRET

export async function handler(req: NextApiRequestWithTokenAndSpace, res: NextApiResponse<DocumentResponse>) {
  const { method, body } = req
  const spaceId = req.query.spaceId as string
  const documentId = req.query.documentId as string
  const userId = req.token.userId as UserId

  try {
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
        const newDocument: WingsDocument = await createDocument(spaceId, { ...body, author_id: userId })
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
      path: '/api/document',
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
