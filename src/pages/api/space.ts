import { NextApiRequest, NextApiResponse } from 'next'
import { Space, SpaceId } from '@/lib/types/es'
import { createSpace, getSpace, updateSpace } from '@/lib/elasticsearch/space'
import logger from '@/lib/logger/pino'
import authenticate from '@/lib/middlewares/authenticate'

type SpaceResponse = {
  data?: Space
  error?: unknown
}

export async function handler(req: NextApiRequest, res: NextApiResponse<SpaceResponse>) {
  const { method, body } = req

  try {
    switch (method) {
      case 'GET':
        const spaceId: SpaceId = req.query.spaceId as string
        // TODO user validation
        const fetchedSpace = await getSpace(spaceId)
        if (!fetchedSpace) {
          res.status(404).json({ error: `${spaceId} not found` })
        } else {
          res.status(200).json({ data: fetchedSpace })
        }
        break

      case 'POST':
        // TODO user validation
        const newSpace: Space = await createSpace(body)
        res.status(200).json({ data: newSpace })
        break

      case 'PUT':
        // TODO user validation
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
  }

  logger.info({
    path: '/api/space',
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
