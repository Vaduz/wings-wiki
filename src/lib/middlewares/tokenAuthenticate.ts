import { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt'
import logger from '@/lib/logger/pino'

const secret = process.env.JWT_SECRET

const tokenAuthenticate = async (req: NextApiRequest, res: NextApiResponse, next: () => void): Promise<void> => {
  try {
    const token = await getToken({ req, secret })

    if (!token) {
      res.status(401).json({ message: 'Unauthorized' })
      logger.warn({
        message: 'No token',
        path: req.url,
        req: { method: req.method, query: req.query, body: req.body },
        res: { status: res.statusCode },
      })
      return
    }

    req.token = token

    next()
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
    logger.error({
      message: 'Unknown error happened in authenticate.ts',
      path: req.url,
      req: { method: req.method, query: req.query, body: req.body },
      res: { status: res.statusCode },
      error: error,
    })
  }
}

export default tokenAuthenticate
