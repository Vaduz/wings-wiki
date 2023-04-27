import { Box, Breadcrumbs, Typography } from '@mui/material'
import React from 'next'
import { useRouter } from 'next/router'
import MuiLink from '@mui/material/Link'
import HomeIcon from '@mui/icons-material/Home'
import { documentBase, spaceBase } from '@/components/global/WingsLink'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import RestoreIcon from '@mui/icons-material/Restore'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import WorkspacesIcon from '@mui/icons-material/Workspaces'
import ViewTimelineOutlinedIcon from '@mui/icons-material/ViewTimelineOutlined'
import { useSpacesContext } from '@/contexts/spaces'
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'

const WingsBreadcrumbs = (): JSX.Element => {
  const router = useRouter()
  const pathNames = router.asPath.split('/')
  let breadCrumb: JSX.Element[] = []
  switch (router.asPath) {
    case '/':
      breadCrumb.push(
        <Box key="breadcrumbs-timeline" sx={{ display: 'flex', alignItems: 'center' }}>
          <ViewTimelineOutlinedIcon sx={{ mr: '0.2rem' }} />
          <Typography color="textPrimary">Timeline</Typography>
        </Box>
      )
      break
    case '/edited':
      breadCrumb.push(
        <Box key="breadcrumbs-edited" sx={{ display: 'flex', alignItems: 'center' }}>
          <EditOutlinedIcon sx={{ mr: '0.2rem' }} />
          <Typography color="textPrimary">Edit History</Typography>
        </Box>
      )
      break
    case '/visited':
      breadCrumb.push(
        <Box key="breadcrumbs-visited" sx={{ display: 'flex', alignItems: 'center' }}>
          <RestoreIcon sx={{ mr: '0.2rem' }} />
          <Typography color="textPrimary">Visited History</Typography>
        </Box>
      )
      break
    case '/starred':
      breadCrumb.push(
        <Box key="breadcrumbs-starred" sx={{ display: 'flex', alignItems: 'center' }}>
          <StarBorderIcon sx={{ mr: '0.2rem' }} />
          <Typography color="textPrimary">Starred Documents</Typography>
        </Box>
      )
      break
    case '/doc':
      breadCrumb.push(
        <Box key="breadcrumbs-space-list" sx={{ display: 'flex', alignItems: 'center' }}>
          <WorkspacesIcon sx={{ mr: '0.2rem' }} />
          <Typography color="textPrimary">Space List</Typography>
        </Box>
      )
      break
  }

  const spacesContext = useSpacesContext()
  const pathCount = router.asPath.split('/').length
  if (spacesContext && router.asPath.startsWith(documentBase) && pathCount >= 3) {
    const spaceId = pathNames[2]
    const space = spacesContext.spaces.find((space) => space.id == spaceId)

    if (pathCount == 3) {
      breadCrumb.push(
        <Box key="breadcrumbs-space-home-primary" sx={{ display: 'flex', alignItems: 'center' }}>
          <WorkspacesIcon sx={{ mr: '0.2rem' }} />
          <Typography color="textPrimary">{(space && space.name) || 'Space Home'}</Typography>
        </Box>
      )
    }

    if (pathCount >= 4) {
      breadCrumb.push(
        <MuiLink
          key="breadcrumbs-space-home-inherit"
          href={spaceBase(spaceId)}
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <WorkspacesIcon sx={{ mr: '0.2rem' }} />
          <Typography color="inherit">{(space && space.name) || 'Space Home'}</Typography>
        </MuiLink>
      )
    }

    const documentId = pathNames[3]
    if (pathCount == 4) {
      if (pathNames[3].startsWith('createDocument')) {
        breadCrumb.push(
          <Box key="breadcrumbs-create-document" sx={{ display: 'flex', alignItems: 'center' }}>
            <TextSnippetOutlinedIcon sx={{ mr: '0.2rem' }} />
            <Typography color="textPrimary">New Document</Typography>
          </Box>
        )
      } else if (pathNames[3].startsWith('search')) {
        breadCrumb.push(
          <Box key="breadcrumbs-search-document" sx={{ display: 'flex', alignItems: 'center' }}>
            <SearchOutlinedIcon sx={{ mr: '0.2rem' }} />
            <Typography color="textPrimary">Search Document</Typography>
          </Box>
        )
      } else {
        breadCrumb.push(
          <Box key="breadcrumbs-view-document" sx={{ display: 'flex', alignItems: 'center' }}>
            <TextSnippetOutlinedIcon sx={{ mr: '0.2rem' }} />
            <Typography color="textPrimary">View Document</Typography>
          </Box>
        )
      }
    }

    if (pathCount == 5) {
      breadCrumb.push(
        <Box key="breadcrumbs-edit-document" sx={{ display: 'flex', alignItems: 'center' }}>
          <TextSnippetOutlinedIcon sx={{ mr: '0.2rem' }} />
          <Typography color="textPrimary">Edit Document</Typography>
        </Box>
      )
    }
  }

  return (
    <Breadcrumbs aria-label="breadcrumb" key="breadcrumbs-root" sx={{ mt: 1, ml: 2 }}>
      <MuiLink href="/" sx={{ display: 'flex', alignItems: 'center' }}>
        <HomeIcon sx={{ mr: '0.2rem' }} />
        <Typography color="inherit">Home</Typography>
      </MuiLink>
      {breadCrumb}
    </Breadcrumbs>
  )
}

export default WingsBreadcrumbs
