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
    if (!req.token) {
      logger.warn({ message: 'token not found' })
      res.status(400).json({ data: undefined })
      return
    }
    const userId = req.token.userId as UserId

    switch (method) {
      case 'GET':
        const user = await getUser(userId)
        if (!user) {
          logger.error({ message: 'Cannot get user', userId: userId })
          res.status(404).json({ error: `${userId} not found` })
        } else if (user.id != userId) {
          res.status(400).json({ data: undefined })
        } else {
          res.status(200).json({ data: user })
        }
        break

      case 'PUT':
        const paramUser = body as User
        if (paramUser.id != userId) {
          res.status(400).json({ data: undefined })
          logger.warn({ message: 'Invalid user update request', paramUser: paramUser, userId: userId })
          return
        }
        await updateUser(paramUser)
        res.status(200).json({ data: paramUser })
        break

      case 'POST':
        // Allow to create new user if user is admin
        res.status(200).json({ data: undefined })
        break

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'POST'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
  } catch (e) {
    res.status(500).json({ error: e })
    logger.error(e)
  } finally {
    logger.info({
      message: 'pages/api/user.ts finally',
      path: '/api/user',
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
