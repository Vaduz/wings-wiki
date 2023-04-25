import { NextApiRequest as NextApiRequestBase } from 'next'
import { Space } from '@/lib/types/elasticsearch'
import { JWT } from 'next-auth/jwt'

export interface NextApiRequestWithToken extends NextApiRequestBase {
  token: JWT
}

export interface NextApiRequestReadSpace extends NextApiRequestBase {
  space: Space
  token?: JWT
}

export interface NextApiRequestWriteSpace extends NextApiRequestBase {
  space: Space
  token: JWT
}
