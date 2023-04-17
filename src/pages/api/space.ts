import { NextApiRequest, NextApiResponse } from 'next'
import { NewSpace, Space, SpaceId, UserId } from '@/lib/types/es'
import { createSpace, getSpace, updateSpace } from '@/lib/elasticsearch/space'
import logger from '@/lib/logger/pino'
import authenticate from '@/lib/middlewares/authenticate'

type SpaceResponse = {
  data?: Space
  error?: unknown
}

export async function handler(req: NextApiRequest, res: NextApiResponse<SpaceResponse>) {
  const { method, body } = req
  const spaceId = req.query.spaceId as string

  try {
    if (!req.token) {
      logger.warn({ message: 'token not found' })
      res.status(400).json({ data: undefined })
      return
    }
    const userId = req.token.userId as UserId

    const space = await getSpace(spaceId)
    if (!space) {
      res.status(404).json({ error: `${spaceId} not found` })
      return
    } else if (!space.members.includes(userId)) {
      res.status(400).json({ data: undefined })
      logger.warn({ message: 'Unauthorized space access', space: space, userId: userId })
      return
    }

    switch (method) {
      case 'GET':
        res.status(200).json({ data: space })
        break

      case 'POST':
        const paramSpace = body as NewSpace
        if (!paramSpace.members.includes(userId)) {
          res.status(400).json({ data: undefined })
          logger.warn({
            message: 'New member must include your userId',
            paramSpace: paramSpace,
            userId: userId,
          })
          return
        }
        const newSpace: Space = await createSpace(paramSpace)
        res.status(200).json({ data: newSpace })
        break

      case 'PUT':
        await updateSpace(body)
        res.status(200).json({ data: body })
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
      message: 'pages/api/space.ts finally',
      path: '/api/space',
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
