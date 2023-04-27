import { Card, CardActionArea, Grid, Link, ListItemIcon } from '@mui/material'
import { documentBase, spaceBase } from '@/components/global/WingsLink'
import { useRouter } from 'next/router'
import Typography from '@mui/material/Typography'
import React from 'react'
import WorkspacesIcon from '@mui/icons-material/Workspaces'
import { useSpacesContext } from '@/contexts/spaces'

const SmallSpaces = ({ withTitle }: { withTitle?: boolean }): JSX.Element => {
  const router = useRouter()
  const spacesContext = useSpacesContext()

  return (
    <Grid container direction="column" py={2}>
      {withTitle && (
        <Typography
          variant="h5"
          sx={{ mb: 1, ml: 1, ':hover': { cursor: 'pointer', textDecoration: 'underline' } }}
          onClick={(e) => {
            e.preventDefault()
            router.push(documentBase).then()
          }}
        >
          Space List
        </Typography>
      )}
      {spacesContext &&
        Array.from(spacesContext.spaces).map((space) => {
          return (
            <Grid item key={space.id}>
              <Card sx={{ my: 1 }}>
                <CardActionArea onClick={() => router.push(spaceBase(space.id)).then()}>
                  <Typography
                    variant="h6"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      m: 1,
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: '2rem' }}>
                      <WorkspacesIcon />
                    </ListItemIcon>
                    {space.name}
                  </Typography>
                  <Typography variant="body1" sx={{ m: 1 }}>
                    {space.description}
                  </Typography>
                </CardActionArea>
              </Card>
            </Grid>
          )
        })}
    </Grid>
  )
}

export default SmallSpaces
