import { useSpacesContext } from '@/contexts/spaces'
import { Card, CardContent, Grid, Link, ListItemIcon, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { Space, SpaceId } from '@/lib/types/elasticsearch'
import WorkspacesIcon from '@mui/icons-material/Workspaces'
import VisibilityChip from '@/components/space/VisibilityChip'
import EditIcon from '@mui/icons-material/Edit'
import { spaceEditPath } from '@/components/global/WingsLink'

export const BigSpaceCardSingle = (): JSX.Element => {
  const spaceContext = useSpacesContext()
  const spaceId = useRouter().query.spaceId as SpaceId
  if (!spaceId || !spaceContext) return <></>
  const space = spaceContext.spaces.find((space) => space.id == spaceId)
  if (!space) return <></>
  return <BigSpaceCard space={space} />
}

const BigSpaceCard = ({ space }: { space: Space }): JSX.Element => {
  return (
    <Card>
      <CardContent>
        <Grid container direction="column" rowSpacing={2}>
          <Grid item xs={12}>
            <Typography
              variant="h2"
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <ListItemIcon>
                <WorkspacesIcon sx={{ mr: 2 }} fontSize={'inherit'} />
              </ListItemIcon>
              {space.name}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">{space.description}</Typography>
          </Grid>
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
        </Grid>
      </CardContent>
    </Card>
  )
}

export default BigSpaceCard
