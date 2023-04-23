import { NextApiResponse } from 'next'
import { NextApiRequestWriteSpace } from '@/lib/types/nextApi'
import logger from '@/lib/logger/pino'
import { UserId } from '@/lib/types/es'
import { getSpace } from '@/lib/elasticsearch/space'
import { getToken } from 'next-auth/jwt'

const secret = process.env.JWT_SECRET

const canWriteSpace = async (req: NextApiRequestWriteSpace, res: NextApiResponse, next: () => void): Promise<void> => {
  const token = await getToken({ req, secret })
  if (!token) {
    logger.warn({ message: 'token not found' })
    res.status(400).json({ data: undefined })
    return
  }
  req.token = token
  const userId = token.userId as UserId

  const spaceId = req.query.spaceId as string
  const space = await getSpace(spaceId)
  if (!space) {
    logger.warn({ message: 'Space not found', spaceId: spaceId })
    res.status(404).json({ data: undefined })
    return
  }

  if (!space.members.includes(userId) && space.owner_id != userId) {
    logger.warn({ message: 'Unauthorized space access', spaceId: spaceId })
    res.status(400).json({ data: undefined })
    return
  }

  req.space = space
  next()
}

export default canWriteSpace
