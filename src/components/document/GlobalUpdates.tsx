import React from 'react'
import { Space } from '@/lib/types/es'
import LatestUpdatedDocuments from '@/components/document/LatestUpdatedDocuments'
import Typography from '@mui/material/Typography'

const GlobalUpdates = ({ spaces }: { spaces: Space[] }): JSX.Element => {
  if (!spaces) return <div>Loading...</div>

  return (
    <>
      <Typography variant="h4" sx={{ my: 2 }}>
        All new updates
      </Typography>
      {Array.from(spaces).map((space) => {
        return <LatestUpdatedDocuments spaceId={space.id} key={space.id} />
      })}
    </>
  )
}

export default GlobalUpdates
