import { NextApiResponse } from 'next'
import { NextApiRequestWriteSpace } from '@/lib/types/nextApiRequest'
import { UserId, WingsDocument } from '@/lib/types/elasticsearch'
import { createDocument, incrementChildren } from '@/lib/elasticsearch/document'
import logger from '@/lib/logger/pino'
import { DocumentResponse } from '@/lib/types/apiResponse'
import canWriteSpace from '@/lib/middlewares/authenticate/canWriteSpace'

export async function handler(req: NextApiRequestWriteSpace, res: NextApiResponse<DocumentResponse>) {
  const { method, body } = req
  const spaceId = req.query.spaceId as string
  const userId = req.token.userId as UserId

  if (!method || method != 'POST') {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${method} Not Allowed`)
    return
  }

  try {
    // TODO Add updated_by created_by
    const newDocument: WingsDocument = await createDocument(spaceId, {
      ...body,
      author_id: userId,
    })
    await incrementChildren(spaceId, body.parent_id)
    res.status(200).json({ data: newDocument })
  } catch (e) {
    res.status(500).json({ error: e })
    logger.error(e)
  } finally {
    logger.info({
      path: '/api/document/create',
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
