import { NextApiRequest, NextApiResponse } from 'next'
import { Space, SpaceId } from '@/lib/types/es'
import { createSpace, getSpace, updateUser } from '@/lib/helpers/elasticsearch'

type SpaceResponse = {
  data?: Space
  error?: unknown
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<SpaceResponse>) {
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
        const newSpace: Space = await createSpace(JSON.parse(body))
        res.status(200).json({ data: newSpace })
        break

      case 'PUT':
        // TODO user validation
        const space = JSON.parse(body)
        await updateUser(space)
        res.status(200).json({ data: space })
        break

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
  } catch (e) {
    console.error(new Date().toISOString(), e)
    res.status(500).json({ error: e })
  }
  console.info(`${new Date().toISOString()} ${method} /api/space`, res.statusCode, req.query, req.body)
}
