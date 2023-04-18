import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import React from 'react'
import logger from '@/lib/logger/pino'

interface AuthenticatedComponentProps {
  children: React.ReactNode
}

const AuthenticatedComponent: React.FC<AuthenticatedComponentProps> = ({ children }) => {
  const { status } = useSession()
  const router = useRouter()

  useEffect(() => {
    // Add any paths that require authentication here
    if (status === 'unauthenticated' && router.pathname.startsWith('/document')) {
      router.push('/401').catch((err) => logger.error(err))
    }
  }, [status, router])

  return <>{children}</>
}

export default AuthenticatedComponent
