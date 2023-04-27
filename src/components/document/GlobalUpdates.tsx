import React from 'react'
import LatestUpdatedDocuments from '@/components/document/LatestUpdatedDocuments'
import Typography from '@mui/material/Typography'
import { useSpacesContext } from '@/contexts/spaces'

const GlobalUpdates = (): JSX.Element => {
  const spacesContext = useSpacesContext()
  return (
    <>
      <Typography variant="h4" sx={{ my: 2 }}>
        All new updates
      </Typography>
      {spacesContext &&
        Array.from(spacesContext.spaces).map((space) => {
          return <LatestUpdatedDocuments spaceId={space.id} key={space.id} />
        })}
    </>
  )
}

export default GlobalUpdates
