import { NextApiRequest as NextApiRequestBase } from 'next'
import { Space } from '@/lib/types/es'
import { JWT } from 'next-auth/jwt'

export interface NextApiRequestWithSpace extends NextApiRequestBase {
  space: Space
}

export interface NextApiRequestWithToken extends NextApiRequestBase {
  token: JWT
}

export interface NextApiRequestWithTokenAndSpace extends NextApiRequestWithToken, NextApiRequestWithSpace {}
