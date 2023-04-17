import { NextApiRequest, NextApiResponse } from 'next'
import { User, UserId } from '@/lib/types/es'
import { getUser, updateUser } from '@/lib/elasticsearch/user'
import logger from '@/lib/logger/pino'
import authenticate from '@/lib/middlewares/authenticate'

type UserResponse = {
  data?: User
  error?: unknown
}

export async function handler(req: NextApiRequest, res: NextApiResponse<UserResponse>) {
  const { method, body } = req
  try {
    switch (method) {
      case 'GET':
        const userId: UserId = req.query.userId as string
        // TODO Check userId and request userId are same
        const fetchedUser = await getUser(userId)
        if (!fetchedUser) {
          res.status(404).json({ error: `${userId} not found` })
        } else {
          res.status(200).json({ data: fetchedUser })
        }
        break

      case 'PUT':
        // TODO Check userId and request userId are same
        await updateUser(body)
        res.status(200).json({ data: body })
        break

      default:
        res.setHeader('Allow', ['GET', 'PUT'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
  } catch (e) {
    res.status(500).json({ error: e })
    logger.error(e)
  }
  logger.info({
    path: '/api/user',
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
