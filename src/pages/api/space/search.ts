import { NextApiResponse } from 'next'
import { UserId } from '@/lib/types/es'
import logger from '@/lib/logger/pino'
import { getUserSpaces } from '@/lib/elasticsearch/space'
import tokenAuthenticate from '@/lib/middlewares/tokenAuthenticate'
import { NextApiRequestWithToken } from '@/lib/types/nextApi'
import { SpaceListResponse } from '@/lib/types/apiResponse'

export async function handler(req: NextApiRequestWithToken, res: NextApiResponse<SpaceListResponse>) {
  const { method, body } = req
  const userId = req.token.userId as UserId

  if (!method || method != 'POST') {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${method} Not Allowed`)
    return
  }

  try {
    const spaces = await getUserSpaces(userId)
    res.status(200).json({ data: spaces })
    logger.debug({ message: 'Fetched spaces', spaces: spaces })
  } catch (e) {
    res.status(500).json({ error: e })
    logger.error(e)
  } finally {
    logger.info({
      path: '/api/space/search',
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
