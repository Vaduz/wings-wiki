import { NextApiResponse } from 'next'
import { Space, UserId } from '@/lib/types/es'
import { createSpace, getSpace, updateSpace } from '@/lib/elasticsearch/space'
import logger from '@/lib/logger/pino'
import { CreateSpaceRequest } from '@/lib/api/space'
import { NextApiRequestWithToken } from '@/lib/types/nextApi'
import tokenAuthenticate from '@/lib/middlewares/tokenAuthenticate'
import { SpaceResponse } from '@/lib/types/apiResponse'

export async function handler(req: NextApiRequestWithToken, res: NextApiResponse<SpaceResponse>) {
  const { method, body } = req
  const userId = req.token.userId as UserId

  try {
    switch (method) {
      case 'GET':
        const spaceId = req.query.spaceId as string
        const fetchedSpace = await getSpace(spaceId)
        if (!fetchedSpace) {
          res.status(404).json({ error: `${spaceId} not found` })
          return
        } else if (!fetchedSpace.members.includes(userId) && fetchedSpace.owner_id != userId) {
          res.status(400).json({ data: undefined })
          logger.warn({ message: 'Unauthorized space access', userId: userId })
          return
        } else {
          res.status(200).json({ data: fetchedSpace })
        }
        break

      case 'POST':
        const postSpace = body as CreateSpaceRequest
        const newSpace: Space = await createSpace({ ...postSpace, owner_id: userId })
        res.status(200).json({ data: newSpace })
        break

      case 'PUT':
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
        break

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
  } catch (e) {
    res.status(500).json({ error: e })
    logger.error(e)
  } finally {
    logger.info({
      path: '/api/space',
      status: res.statusCode,
      req: { method: method, query: req.query, body: body, userId: userId },
    })
  }
}

export default function withMiddleware(req: NextApiRequestWithToken, res: NextApiResponse) {
  return new Promise<void>((resolve, reject) => {
    tokenAuthenticate(req, res, () => {
      handler(req, res).then()
      resolve()
    }).then()
  })
}
