import NextAuth from 'next-auth'
import GoogleProvider, { GoogleProfile } from 'next-auth/providers/google'

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
    signIn: async ({ user, account, profile, email, credentials }) => {
      console.log('user', user)
      console.log('account', account)
      console.log('profile', profile)
      console.log('email', email)
      console.log('credentials', credentials)
      if (account && account.provider === 'google') {
        const googleProfile = profile as GoogleProfile
        return googleProfile.email_verified
      }
      return true
    },
  },
  secret: process.env.JWT_SECRET ?? 'Empty JWT_SECRET!',
  session: {
    strategy: 'jwt',
  },
})
