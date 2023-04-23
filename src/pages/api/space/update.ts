import { NextApiResponse } from 'next'
import { Space, UserId } from '@/lib/types/es'
import { getSpace, updateSpace } from '@/lib/elasticsearch/space'
import logger from '@/lib/logger/pino'
import { NextApiRequestReadSpace } from '@/lib/types/nextApi'
import { SpaceResponse } from '@/lib/types/apiResponse'
import canReadSpace from '@/lib/middlewares/authenticate/canReadSpace'

export async function handler(req: NextApiRequestReadSpace, res: NextApiResponse<SpaceResponse>) {
  const { method, body } = req
  if (!method || method != 'PUT') {
    res.setHeader('Allow', ['PUT'])
    res.status(405).end(`Method ${method} Not Allowed`)
    return
  }

  try {
    if (!req.token) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }
    const userId = req.token.userId as UserId

    const putSpace = body as Space
    const targetSpace = await getSpace(putSpace.id)
    if (!targetSpace) {
      res.status(404).json({ error: `${putSpace.id} not found` })
      return
    } else if (!targetSpace.members.includes(userId) && targetSpace.owner_id != userId) {
      res.status(400).json({ data: undefined })
      logger.warn({ message: 'Unauthorized space access', space: targetSpace, userId: userId })
      return
    } else {
      await updateSpace(body)
      res.status(200).json({ data: body })
    }
  } catch (e) {
    res.status(500).json({ error: e })
    logger.error(e)
  } finally {
    logger.info({
      path: '/api/space/update',
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
