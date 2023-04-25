import { NextApiResponse } from 'next'
import { Space, UserId } from '@/lib/types/elasticsearch'
import { createSpace } from '@/lib/elasticsearch/space'
import logger from '@/lib/logger/pino'
import { NextApiRequestWithToken } from '@/lib/types/nextApiRequest'
import hasToken from '@/lib/middlewares/authenticate/hasToken'
import { SpaceResponse } from '@/lib/types/apiResponse'
import { CreateSpaceRequest } from '@/lib/types/apiRequest'

export async function handler(req: NextApiRequestWithToken, res: NextApiResponse<SpaceResponse>) {
  const { method, body } = req
  const userId = req.token.userId as UserId

  if (!method || method != 'POST') {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${method} Not Allowed`)
    return
  }

  try {
    // TODO Check user's create space count
    const postSpace = body as CreateSpaceRequest
    const newSpace: Space = await createSpace({ ...postSpace, owner_id: userId })
    res.status(200).json({ data: newSpace })
  } catch (e) {
    res.status(500).json({ error: e })
    logger.error(e)
  } finally {
    logger.info({
      path: '/api/space/create',
      status: res.statusCode,
      req: { method: method, query: req.query, body: body, userId: userId },
    })
  }
}

export default function withMiddleware(req: NextApiRequestWithToken, res: NextApiResponse) {
  return new Promise<void>((resolve, reject) => {
    hasToken(req, res, () => {
      handler(req, res).then()
      resolve()
    }).then()
  })
}
