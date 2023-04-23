import { NextApiResponse } from 'next'
import { NextApiRequestReadSpace } from '@/lib/types/nextApi'
import { getDocument } from '@/lib/elasticsearch/document'
import logger from '@/lib/logger/pino'
import canReadSpace from '@/lib/middlewares/authenticate/canReadSpace'
import { DocumentResponse } from '@/lib/types/apiResponse'

export async function handler(req: NextApiRequestReadSpace, res: NextApiResponse<DocumentResponse>) {
  const { method, body } = req
  const spaceId = req.query.spaceId as string
  const documentId = req.query.documentId as string

  if (!method || method != 'GET') {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${method} Not Allowed`)
    return
  }

  try {
    const wingsDocument = await getDocument(spaceId, documentId)
    if (!wingsDocument) {
      res.status(404).json({ error: `${documentId} not found` })
    } else {
      res.status(200).json({ data: wingsDocument })
    }
  } catch (e) {
    res.status(500).json({ error: e })
    logger.error(e)
  } finally {
    logger.info({
      path: '/api/document',
      status: res.statusCode,
      req: { method: method, query: req.query, body: body },
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
