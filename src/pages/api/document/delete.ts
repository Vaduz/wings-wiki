import { NextApiResponse } from 'next'
import { NextApiRequestWriteSpace } from '@/lib/types/nextApiRequest'
import { deleteDocument, getDocument } from '@/lib/elasticsearch/document'
import logger from '@/lib/logger/pino'
import { DocumentResponse } from '@/lib/types/apiResponse'
import { UserId } from '@/lib/types/elasticsearch'
import canWriteSpace from '@/lib/middlewares/authenticate/canWriteSpace'

export async function handler(req: NextApiRequestWriteSpace, res: NextApiResponse<DocumentResponse>) {
  const { method, body } = req
  const spaceId = req.query.spaceId as string
  const documentId = req.query.documentId as string
  const userId = req.token.userId as UserId

  if (!method || method != 'DELETE') {
    res.setHeader('Allow', ['DELETE'])
    res.status(405).end(`Method ${method} Not Allowed`)
    return
  }

  try {
    const wingsDocument = await getDocument(spaceId, documentId)
    if (!wingsDocument) {
      logger.warn({ message: 'Target document not found', spaceId: spaceId, documentId: documentId })
      res.status(404).json({ data: undefined })
      return
    }

    if (wingsDocument.author_id != userId) {
      logger.warn({
        message: `Not an owner`,
        author_id: wingsDocument.author_id,
        token: req.token,
      })
      res.status(400).json({ data: undefined })
      return
    }

    await deleteDocument(spaceId, documentId)
    res.status(200).json({ data: undefined })
  } catch (e) {
    res.status(500).json({ error: e })
    logger.error(e)
  } finally {
    logger.info({
      path: '/api/document/delete',
      status: res.statusCode,
      req: { method: method, query: req.query, body: body, userId: userId },
    })
  }
}

export default function withMiddleware(req: NextApiRequestWriteSpace, res: NextApiResponse) {
  return new Promise<void>((resolve, reject) => {
    canWriteSpace(req, res, () => {
      handler(req, res).then()
      resolve()
    }).then()
  })
}
