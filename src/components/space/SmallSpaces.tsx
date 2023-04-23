import { Space } from '@/lib/types/es'
import { Grid, ListItemIcon } from '@mui/material'
import { documentBase, spaceBase } from '@/components/global/WingsLink'
import { useRouter } from 'next/router'
import Typography from '@mui/material/Typography'
import TextSnippetIcon from '@mui/icons-material/TextSnippet'
import React from 'react'

const SmallSpaces = ({ spaces }: { spaces: Space[] }): JSX.Element => {
  const router = useRouter()
  if (!spaces) return <div>Loading</div>

  return (
    <Grid container direction="column" px={1}>
      <Typography
        variant="h5"
        sx={{ my: 1, ':hover': { cursor: 'pointer', textDecoration: 'underline' } }}
        onClick={() => router.push(documentBase).then()}
      >
        Spaces
      </Typography>
      {Array.from(spaces).map((space) => {
        return (
          <Grid item key={space.id} onClick={() => router.push(spaceBase(space.id)).then()} sx={{ my: 1 }}>
            <Typography
              variant="body1"
              sx={{
                display: 'flex',
                alignItems: 'center',
                ':hover': { cursor: 'pointer', textDecoration: 'underline' },
              }}
            >
              <ListItemIcon sx={{ minWidth: '2rem' }}>
                <TextSnippetIcon />
              </ListItemIcon>
              {space.name}
            </Typography>
          </Grid>
        )
      })}
    </Grid>
  )
}

export default SmallSpaces
