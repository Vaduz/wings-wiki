import NextAuth, { Account, Profile, User } from 'next-auth'
import GoogleProvider, { GoogleProfile } from 'next-auth/providers/google'
import { JWT } from 'next-auth/jwt'
import { createUser, findUserByEmail, findUserByProvider, updateUser } from '@/lib/elasticsearch/user'
import logger from '@/lib/logger/pino'

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? 'Empty GOOGLE_CLIENT_ID!',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? 'Empty GOOGLE_CLIENT_SECRET!',
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      logger.debug({
        message: 'Sign in requested',
        user: user,
        account: account,
        profile: profile,
        email: email,
        credentials: credentials,
      })

      const isNewUser = user.id === null
      if (account && account.provider === 'google') {
        if (!profile || !profile.sub || !user || !user.email || !user.name) return false
        if (isNewUser) {
          const googleProfile = profile as GoogleProfile
          if (!googleProfile.email_verified) {
            logger.info({ message: 'email is not verified', email: email, googleProfile: googleProfile })
            return false
          }
          const newUser = await createUser({
            oauth_provider: 'Google',
            oauth_id: profile.sub,
            email: user.email,
            name: user.name,
            avatar_url: user.image ?? '',
          })
          logger.info({ message: 'New user signed in', isNewUser: isNewUser, user: newUser })
          user.userId = newUser.id
          return true
        } else {
          const existingUser = await findUserByProvider('Google', profile.sub)
          logger.info({ message: 'Existing user signed in', isNewUser: isNewUser, user: existingUser })
          if (existingUser) {
            user.userId = existingUser.id
            return true
          } else {
            const hasEmailUser = await findUserByEmail(user.email)
            logger.info({ message: 'hasEmailUser fetched', hasEmailUser: hasEmailUser })
            if (!hasEmailUser) {
              logger.info({ message: 'Email not found', user: hasEmailUser })
              return false
            }
            if (hasEmailUser && !hasEmailUser.oauth_id && !hasEmailUser.oauth_provider) {
              // pre created user
              hasEmailUser.oauth_provider = 'Google'
              hasEmailUser.oauth_id = profile.sub
              hasEmailUser.name = user.name
              hasEmailUser.avatar_url = user.image ?? ''
              const updatedUser = await updateUser(hasEmailUser)
              logger.info({ message: 'Pre-created has been updated', user: updatedUser })
              return true
            } else {
              logger.info({ message: 'Wrong OAuth provider', user: hasEmailUser })
              return false
            }
          }
        }
      }
      return false
    },
    async jwt({
      token,
      user,
      account,
      profile,
      isNewUser,
    }: {
      token: JWT
      user?: User | null
      account?: Account | null
      profile?: Profile | undefined
      isNewUser?: boolean | undefined
    }) {
      logger.debug({ message: 'jwt', userId: user?.userId })
      if (user) {
        token.userId = user.userId
      }
      return token
    },
  },
  secret: process.env.JWT_SECRET ?? 'Empty JWT_SECRET!',
  session: {
    strategy: 'jwt',
  },
})
