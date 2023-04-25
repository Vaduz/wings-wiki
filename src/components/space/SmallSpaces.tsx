import { Space } from '@/lib/types/elasticsearch'
import { Card, CardActionArea, Grid, ListItemIcon } from '@mui/material'
import { documentBase, spaceBase } from '@/components/global/WingsLink'
import { useRouter } from 'next/router'
import Typography from '@mui/material/Typography'
import React from 'react'
import HomeIcon from '@mui/icons-material/Home'

const SmallSpaces = ({ spaces }: { spaces: Space[] }): JSX.Element => {
  const router = useRouter()

  return (
    <Grid container direction="column" py={2}>
      <Typography
        variant="h5"
        sx={{ mb: 1, ml: 1, ':hover': { cursor: 'pointer', textDecoration: 'underline' } }}
        onClick={() => router.push(documentBase).then()}
      >
        Spaces
      </Typography>
      {Array.from(spaces).map((space) => {
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
                    <HomeIcon />
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
