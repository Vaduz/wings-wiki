import { JWT } from 'next-auth/jwt'
import { UserId } from '@/lib/types/es'

declare module 'next' {
  export interface NextApiRequest {
    token?: JWT
  }
}

declare module 'next-auth' {
  export interface User {
    userId: UserId
  }
}
