import { NextApiRequest, NextApiResponse } from 'next'
import authenticate from '@/lib/middlewares/authenticate'
import { Space, UserId } from '@/lib/types/es'
import logger from '@/lib/logger/pino'
import { getUserSpaces } from '@/lib/elasticsearch/space'

type SpaceListResponse = {
  data?: Space[]
  error?: unknown
}

export async function handler(req: NextApiRequest, res: NextApiResponse<SpaceListResponse>) {
  const { method, body } = req

  try {
    if (method != 'POST') {
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
      return
    }

    if (!req.token) {
      logger.warn({ message: 'token not found' })
      res.status(400).json({ data: undefined })
      return
    }
    const userId = req.token.userId as UserId

    const spaces = await getUserSpaces(userId)
    res.status(200).json({ data: spaces })
    logger.debug({ message: 'Fetched spaces', spaces: spaces })
  } catch (e) {
    res.status(500).json({ error: e })
    logger.error(e)
  } finally {
    logger.info({
      message: 'pages/api/space/search.ts finally',
      path: '/api/space/search',
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
