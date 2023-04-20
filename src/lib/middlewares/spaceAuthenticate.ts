import { NextApiResponse } from 'next'
import { NextApiRequestWithSpace } from '@/lib/types/nextApi'
import logger from '@/lib/logger/pino'
import { UserId } from '@/lib/types/es'
import { getSpace } from '@/lib/elasticsearch/space'

const spaceAuthenticate = async (
  req: NextApiRequestWithSpace,
  res: NextApiResponse,
  next: () => void
): Promise<void> => {
  const spaceId = req.query.spaceId as string

  if (!req.token) {
    logger.warn({ message: 'token not found' })
    res.status(400).json({ data: undefined })
    return
  }
  const userId = req.token.userId as UserId

  const space = await getSpace(spaceId)
  if (!space) {
    logger.warn({ message: 'Space not found', spaceId: spaceId })
    res.status(400).json({ data: undefined })
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

export default spaceAuthenticate
