import { useSpacesContext } from '@/contexts/spaces'
import { Card, CardContent, Grid, Link, ListItemIcon, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { Space, SpaceId } from '@/lib/types/elasticsearch'
import WorkspacesIcon from '@mui/icons-material/Workspaces'
import VisibilityChip from '@/components/space/VisibilityChip'
import EditIcon from '@mui/icons-material/Edit'
import { documentBase, spaceBase, spaceEditPath } from '@/components/global/WingsLink'

export const BigSpaceCardSingle = (): JSX.Element => {
  const spacesContext = useSpacesContext()
  const spaceId = useRouter().query.spaceId as SpaceId
  if (!spaceId || !spacesContext) return <></>
  const space = spacesContext.spaces.find((space) => space.id == spaceId)
  if (!space) return <></>
  return <SpaceCard space={space} bigTitle />
}

export const SmallSpaceCards = ({ withTitle }: { withTitle?: boolean }): JSX.Element => {
  const router = useRouter()
  const spacesContext = useSpacesContext()
  if (!spacesContext) return <></>

  return (
    <Grid container direction="column" rowSpacing={2}>
      {withTitle && (
        <Grid item>
          <Link href={spaceBase(documentBase)} color="inherit" underline="hover">
            <Typography
              variant="h5"
              sx={{ mb: 1, ml: 1 }}
              onClick={(e) => {
                e.preventDefault()
                router.push(documentBase).then()
              }}
            >
              Space List
            </Typography>
          </Link>
        </Grid>
      )}
      {Array.from(spacesContext.spaces).map((space) => {
        return (
          <Grid item key={`${space.id}-container`}>
            <SpaceCard space={space} key={space.id} />
          </Grid>
        )
      })}
    </Grid>
  )
}

const SpaceCard = ({ space, bigTitle }: { space: Space; bigTitle?: boolean }): JSX.Element => {
  return (
    <Card>
      <CardContent>
        <Grid container direction="column" rowSpacing={2}>
          <Grid item xs={12}>
            <Link href={spaceBase(space.id)} color="inherit" underline="hover">
              <Typography
                variant={bigTitle ? 'h2' : 'h5'}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <ListItemIcon sx={bigTitle ? { mr: 2 } : { minWidth: '2rem' }}>
                  <WorkspacesIcon fontSize="inherit" />
                </ListItemIcon>
                {space.name}
              </Typography>
            </Link>
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
                  color="gray"
                  fontSize="small"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <ListItemIcon sx={{ minWidth: '1.5rem' }}>
                    <EditIcon fontSize="small" />
                  </ListItemIcon>
                  Edit Space
                </Link>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default SpaceCard
