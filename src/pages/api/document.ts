import { NextApiRequest, NextApiResponse } from 'next'
import { WingsDocument, DocumentId } from '@/lib/types/es'
import { createDocument, getDocument, updateDocument, deleteDocument } from '@/lib/elasticsearch/document'
import logger from '@/lib/logger/pino'
import authenticate from '@/lib/middlewares/authenticate'

type DocumentResponse = {
  data?: WingsDocument
  error?: unknown
}

const secret = process.env.JWT_SECRET

export async function handler(req: NextApiRequest, res: NextApiResponse<DocumentResponse>) {
  const { method, body } = req
  logger.info({ token: req.token })

  try {
    switch (method) {
      case 'GET':
        const documentId: DocumentId = req.query.documentId as string
        // TODO user validation
        const fetchedDocument = await getDocument(req.query.spaceId as string, documentId)
        if (!fetchedDocument) {
          res.status(404).json({ error: `${documentId} not found` })
        } else {
          res.status(200).json({ data: fetchedDocument })
        }
        break

      case 'POST':
        // TODO user validation
        const newDocument: WingsDocument = await createDocument(req.query.spaceId as string, body)
        res.status(200).json({ data: newDocument })
        break

      case 'PUT':
        // TODO user validation
        await updateDocument(req.query.spaceId as string, body)
        res.status(200).json({ data: body })
        break

      case 'DELETE':
        // TODO user validation
        await deleteDocument(req.query.spaceId as string, req.query.documentId as string)
        res.status(200).json({ data: undefined })
        break

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
  } catch (e) {
    res.status(500).json({ error: e })
    logger.error(e)
  }

  logger.info({
    path: '/api/document',
    req: { method: method, query: req.query, body: body },
    res: { status: res.statusCode },
  })
}

export default function withMiddleware(req: NextApiRequest, res: NextApiResponse) {
  return new Promise<void>((resolve, reject) => {
    authenticate(req, res, () => {
      handler(req, res).then()
      resolve()
    }).then()
  })
}
