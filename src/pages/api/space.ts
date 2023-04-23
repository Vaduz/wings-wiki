import { NextApiResponse } from 'next'
import { UserId } from '@/lib/types/es'
import { getSpace } from '@/lib/elasticsearch/space'
import logger from '@/lib/logger/pino'
import { NextApiRequestWithToken } from '@/lib/types/nextApi'
import { SpaceResponse } from '@/lib/types/apiResponse'
import { getToken } from 'next-auth/jwt'

const secret = process.env.JWT_SECRET

export async function handler(req: NextApiRequestWithToken, res: NextApiResponse<SpaceResponse>) {
  const { method, body } = req
  if (!method || method != 'GET') {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${method} Not Allowed`)
    return
  }
  const token = await getToken({ req, secret })

  try {
    const spaceId = req.query.spaceId as string
    const space = await getSpace(spaceId)
    if (!space) {
      res.status(404).json({ error: `${spaceId} not found` })
      return
    } else if (space.visibility == 1) {
      res.status(200).json({ data: space })
      return
    } else if (!token) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }

    const userId = token.userId as UserId
    if (!space.members.includes(userId) && space.owner_id != userId) {
      res.status(400).json({ data: undefined })
      logger.warn({ message: 'Unauthorized space access', userId: userId })
      return
    } else {
      res.status(200).json({ data: space })
    }
  } catch (e) {
    res.status(500).json({ error: e })
    logger.error(e)
  } finally {
    logger.info({
      path: '/api/space',
      status: res.statusCode,
      req: { method: method, query: req.query, body: body, userId: token?.userId },
    })
  }
}

export default handler
