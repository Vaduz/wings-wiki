import { NextApiResponse } from 'next'
import { updateSpace } from '@/lib/elasticsearch/space'
import logger from '@/lib/logger/pino'
import { NextApiRequestWriteSpace } from '@/lib/types/nextApiRequest'
import { SpaceResponse } from '@/lib/types/apiResponse'
import { UpdateSpaceRequest } from '@/lib/types/apiRequest'
import canWriteSpace from '@/lib/middlewares/authenticate/canWriteSpace'

export async function handler(req: NextApiRequestWriteSpace, res: NextApiResponse<SpaceResponse>) {
  const { method, body } = req
  if (!method || method != 'PUT') {
    res.setHeader('Allow', ['PUT'])
    res.status(405).end(`Method ${method} Not Allowed`)
    return
  }

  try {
    if (!req.token) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }

    const reqSpace = body as UpdateSpaceRequest
    const targetSpace = req.space
    const space = {
      ...targetSpace,
      name: reqSpace.name,
      description: reqSpace.description,
      visibility: reqSpace.visibility,
      members: reqSpace.members,
    }
    await updateSpace(space)
    res.status(200).json({ data: body })
  } catch (e) {
    res.status(500).json({ error: e })
    logger.error(e)
  } finally {
    logger.info({
      path: '/api/space/update',
      status: res.statusCode,
      req: { method: method, query: req.query, body: body, userId: req.token?.userId },
    })
  }
}

export default function withMiddleware(req: NextApiRequestWriteSpace, res: NextApiResponse) {
  return new Promise<void>((resolve, reject) => {
    canWriteSpace(req, res, () => {
      handler(req, res).then()
      resolve()
    }).then()
  })
}
