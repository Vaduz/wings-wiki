import { NextApiRequest, NextApiResponse } from 'next'
import { Space, UserId } from '@/lib/types/elasticsearch'
import logger from '@/lib/logger/pino'
import { getPublicSpaces, getUserSpaces } from '@/lib/elasticsearch/space'
import { SpaceListResponse } from '@/lib/types/apiResponse'
import { getToken } from 'next-auth/jwt'

const secret = process.env.JWT_SECRET

export async function handler(req: NextApiRequest, res: NextApiResponse<SpaceListResponse>) {
  const { method, body } = req

  if (!method || method != 'POST') {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${method} Not Allowed`)
    return
  }

  try {
    let spaces: Space[] = await getPublicSpaces()
    logger.info({ publicSpaces: spaces })

    const token = await getToken({ req, secret })
    if (token) {
      const userId = token.userId as UserId
      const userSpaces = await getUserSpaces(userId)
      spaces.push(...userSpaces)
    }
    res.status(200).json({ data: spaces })
    logger.debug({ message: 'Fetched spaces', spaces: spaces })
  } catch (e) {
    res.status(500).json({ error: e })
    logger.error(e)
  } finally {
    logger.info({
      path: '/api/space/search',
      status: res.statusCode,
      req: { method: method, query: req.query, body: body },
    })
  }
}

export default handler
