import { Card, CardActionArea, CardContent, Grid, Link, ListItemIcon } from '@mui/material'
import { documentBase, spaceBase, spaceEditPath } from '@/components/global/WingsLink'
import { useRouter } from 'next/router'
import Typography from '@mui/material/Typography'
import React from 'react'
import WorkspacesIcon from '@mui/icons-material/Workspaces'
import { useSpacesContext } from '@/contexts/spaces'
import VisibilityChip from '@/components/space/VisibilityChip'
import EditIcon from '@mui/icons-material/Edit'
import { useSession } from 'next-auth/react'

const SmallSpaces = ({ withTitle }: { withTitle?: boolean }): JSX.Element => {
  const router = useRouter()
  const spacesContext = useSpacesContext()
  const { data, status } = useSession()
  const isLoggedIn = !!(data && status == 'authenticated')

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
                <CardContent>
                  <Grid container direction="column" rowSpacing={2}>
                    <Grid item xs={12}>
                      <Link href={spaceBase(space.id)} color="inherit" underline="hover">
                        <Typography
                          variant="h5"
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: '2rem' }}>
                            <WorkspacesIcon />
                          </ListItemIcon>
                          {space.name}
                        </Typography>
                      </Link>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="body1">{space.description}</Typography>
                    </Grid>

                    {isLoggedIn && (
                      <Grid item xs={12}>
                        <Grid container direction="row" justifyContent="space-between" alignItems="center">
                          <Grid item>
                            <VisibilityChip visibility={space.visibility} />
                          </Grid>
                          <Grid item>
                            <Link
                              href={spaceEditPath(space.id)}
                              underline="hover"
                              color="inherit"
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                              }}
                            >
                              <ListItemIcon sx={{ minWidth: '1.75rem' }}>
                                <EditIcon fontSize="small" />
                              </ListItemIcon>
                              Edit
                            </Link>
                          </Grid>
                        </Grid>
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          )
        })}
    </Grid>
  )
}

export default SmallSpaces
