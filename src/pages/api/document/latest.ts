import { NextApiResponse } from 'next'
import { NextApiRequestReadSpace } from '@/lib/types/nextApi'
import logger from '@/lib/logger/pino'
import { getLatestDocuments } from '@/lib/elasticsearch/document'
import { DocumentHomeResponse } from '@/lib/types/apiResponse'
import canReadSpace from '@/lib/middlewares/authenticate/canReadSpace'

export async function handler(req: NextApiRequestReadSpace, res: NextApiResponse<DocumentHomeResponse>) {
  const { method, body } = req
  const spaceId = req.query.spaceId as string
  const sizeParam = req.query.count as string
  const size = sizeParam ? Math.min(parseInt(sizeParam, 10), 20) : 10

  if (!method || method != 'POST') {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${method} Not Allowed`)
    return
  }

  try {
    const documents = await getLatestDocuments(spaceId, size)
    res.status(200).json({ data: { space: req.space, documents: documents } })
    logger.debug({ message: 'Fetched documents', documents: documents })
  } catch (e) {
    res.status(500).json({ error: e })
    logger.error(e)
  } finally {
    logger.info({
      path: '/api/document/latest',
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
