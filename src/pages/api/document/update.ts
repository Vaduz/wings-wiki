import { NextApiResponse } from 'next'
import { NextApiRequestWriteSpace } from '@/lib/types/nextApi'
import { updateDocument } from '@/lib/elasticsearch/document'
import logger from '@/lib/logger/pino'
import { DocumentResponse } from '@/lib/types/apiResponse'
import canWriteSpace from '@/lib/middlewares/authenticate/canWriteSpace'
import { UserId } from '@/lib/types/es'

export async function handler(req: NextApiRequestWriteSpace, res: NextApiResponse<DocumentResponse>) {
  const { method, body } = req
  const spaceId = req.query.spaceId as string
  const userId = req.token.userId as UserId
  if (!method || method != 'PUT') {
    res.setHeader('Allow', ['PUT'])
    res.status(405).end(`Method ${method} Not Allowed`)
    return
  }

  try {
    // TODO Add updated_by
    await updateDocument(spaceId, body)
    res.status(200).json({ data: body })
  } catch (e) {
    res.status(500).json({ error: e })
    logger.error(e)
  } finally {
    logger.info({
      path: '/api/document/update',
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
