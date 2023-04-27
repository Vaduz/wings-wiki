import { Space } from '@/lib/types/elasticsearch'
import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { getSpacesApi } from '@/lib/api/space'
import logger from '@/lib/logger/pino'
import React from 'react'

interface SpacesContextValue {
  spaces: Space[]
  setSpaces: React.Dispatch<React.SetStateAction<Space[]>>
}

const SpacesContext = createContext<SpacesContextValue | null>(null)

interface SpacesContextProviderProps {
  children: ReactNode
}

const SpacesContextProvider = ({ children }: SpacesContextProviderProps) => {
  const [spaces, setSpaces] = useState<Space[]>([])

  useEffect(() => {
    getSpacesApi()
      .then((r) => setSpaces(r))
      .catch((e) => logger.error({ message: 'context/spaces.tsx', error: e }))
  }, [])

  return <SpacesContext.Provider value={{ spaces, setSpaces }}>{children}</SpacesContext.Provider>
}

const useSpacesContext = () => useContext(SpacesContext)

export { useSpacesContext, SpacesContextProvider }
