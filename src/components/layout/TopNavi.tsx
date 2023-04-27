import React, { useState } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'
import { documentBase, newDocumentPath, newSpacePath, searchPath, spaceBase } from '@/components/global/WingsLink'
import { Space, SpaceId } from '@/lib/types/elasticsearch'
import { useRouter } from 'next/router'
import MenuIcon from '@mui/icons-material/Menu'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import LogoutIcon from '@mui/icons-material/Logout'
import HomeIcon from '@mui/icons-material/Home'
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Divider,
  ListItemIcon,
} from '@mui/material'
import WorkspacesIcon from '@mui/icons-material/Workspaces'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import AddIcon from '@mui/icons-material/Add'
import ViewTimelineOutlinedIcon from '@mui/icons-material/ViewTimelineOutlined'
import RestoreIcon from '@mui/icons-material/Restore'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import { Check } from '@mui/icons-material'
import { useSpacesContext } from '@/contexts/spaces'

const TopNavi = (): JSX.Element => {
  const spaceId = useRouter().query.spaceId as SpaceId
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Masthead />
          <MobileScreenMenu spaceId={spaceId} />
          <Masthead isMobile />
          <RegularScreenMenu spaceId={spaceId} />
          <UserMenu />
        </Toolbar>
      </Container>
    </AppBar>
  )
}

const Masthead = ({ isMobile }: { isMobile?: boolean }): JSX.Element => {
  const router = useRouter()
  const diffParam = isMobile
    ? { display: { xs: 'flex', md: 'none' }, flexGrow: 1 }
    : { display: { xs: 'none', md: 'flex' } }
  return (
    <Typography
      variant="h5"
      noWrap
      sx={{
        mr: 2,
        fontFamily: 'Hiragino',
        fontWeight: 700,
        letterSpacing: '.2rem',
        color: 'inherit',
        textDecoration: 'none',
        cursor: 'pointer',
        ...diffParam,
      }}
      onClick={(e) => {
        e.preventDefault()
        router.push('/').then()
      }}
    >
      Wings
    </Typography>
  )
}

const RegularScreenMenu = ({ spaceId }: { spaceId?: SpaceId }): JSX.Element => {
  const router = useRouter()
  const [anchorElHome, setAnchorElHome] = useState<null | HTMLElement>(null)
  const [anchorElSpace, setAnchorElSpace] = useState<null | HTMLElement>(null)
  const [anchorElDocument, setAnchorElDocument] = useState<null | HTMLElement>(null)
  const spacesContext = useSpacesContext()

  return (
    <>
      <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
        <Button key="Home" onClick={(e) => setAnchorElHome(e.currentTarget)} sx={{ my: 2, color: 'white' }}>
          <HomeIcon sx={{ mr: '0.2rem' }} />
          Home
          <ChevronRightIcon sx={{ transform: 'rotate(90deg)' }} />
        </Button>
        <Menu
          sx={{ mt: '45px' }}
          id="home-menu-appbar"
          anchorEl={anchorElHome}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorElHome)}
          onClose={() => setAnchorElHome(null)}
        >
          <MenuItem
            key="root-home"
            href={'/'}
            onClick={(e) => {
              e.preventDefault()
              router.push('/').then()
              setAnchorElHome(null)
            }}
          >
            <ListItemIcon>
              <ViewTimelineOutlinedIcon />
            </ListItemIcon>
            <Typography sx={{ display: 'flex', alignItems: 'center' }}>Timeline</Typography>
          </MenuItem>
          <MenuItem
            key="root-edited"
            href={'/edited'}
            onClick={(e) => {
              e.preventDefault()
              router.push('/edited').then()
              setAnchorElHome(null)
            }}
          >
            <ListItemIcon>
              <EditOutlinedIcon />
            </ListItemIcon>
            <Typography sx={{ display: 'flex', alignItems: 'center' }}>Edited</Typography>
          </MenuItem>
          <MenuItem
            key="root-visited-history"
            href={'/visited'}
            onClick={() => {
              router.push('/visited').then()
              setAnchorElHome(null)
            }}
          >
            <ListItemIcon>
              <RestoreIcon />
            </ListItemIcon>
            <Typography sx={{ display: 'flex', alignItems: 'center' }}>Visited History</Typography>
          </MenuItem>
          <MenuItem
            key="root-starred"
            href={'/starred'}
            onClick={(e) => {
              e.preventDefault()
              router.push('/starred').then()
              setAnchorElHome(null)
            }}
          >
            <ListItemIcon>
              <StarBorderIcon />
            </ListItemIcon>
            <Typography sx={{ display: 'flex', alignItems: 'center' }}>Starred</Typography>
          </MenuItem>
        </Menu>
        <Button key="Spaces" onClick={(e) => setAnchorElSpace(e.currentTarget)} sx={{ my: 2, color: 'white' }}>
          {
            <>
              <WorkspacesIcon sx={{ mr: '0.4rem' }} />
              {(spacesContext && spacesContext.spaces.find((space) => space.id == spaceId)?.name) || 'Space'}
            </>
          }
          <ChevronRightIcon sx={{ transform: 'rotate(90deg)' }} />
        </Button>
        <Menu
          sx={{ mt: '45px' }}
          id="space-menu-appbar"
          anchorEl={anchorElSpace}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorElSpace)}
          onClose={() => setAnchorElSpace(null)}
        >
          <MenuItem
            key="all-spaces"
            onClick={(e) => {
              e.preventDefault()
              router.push(documentBase).then()
              setAnchorElSpace(null)
            }}
          >
            <Typography>Space List</Typography>
          </MenuItem>
          <Divider key="spaces-divider" />
          {spacesContext &&
            Array.from(spacesContext.spaces).map((space) => {
              return (
                <MenuItem
                  key={`space-${space.id}`}
                  href={spaceBase(space.id)}
                  onClick={(e) => {
                    e.preventDefault()
                    router.push(spaceBase(space.id)).then()
                    setAnchorElSpace(null)
                  }}
                >
                  <ListItemIcon>{(space.id == spaceId && <Check />) || <WorkspacesIcon />}</ListItemIcon>
                  <Typography sx={{ display: 'flex', alignItems: 'center' }}>{space.name}</Typography>
                </MenuItem>
              )
            })}
          <Divider key="new-space-divider" />
          <MenuItem
            key="new-space"
            href={newSpacePath}
            onClick={(e) => {
              e.preventDefault()
              router.push(newSpacePath).then()
              setAnchorElSpace(null)
            }}
          >
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <Typography>New Space</Typography>
          </MenuItem>
        </Menu>
        {spaceId && (
          <>
            <Button
              key="New Document"
              href={newDocumentPath(spaceId)}
              onClick={(e) => {
                e.preventDefault()
                router.push(newDocumentPath(spaceId)).then()
                setAnchorElSpace(null)
              }}
              sx={{ my: 2, color: 'white' }}
            >
              <EditOutlinedIcon sx={{ mr: '0.2rem' }} />
              New Document
            </Button>
            <Button
              key="Search"
              href={searchPath(spaceId)}
              onClick={(e) => {
                e.preventDefault()
                router.push(searchPath(spaceId)).then()
              }}
              sx={{ my: 2, color: 'white' }}
            >
              <SearchOutlinedIcon sx={{ mr: '0.2rem' }} />
              Search
            </Button>
          </>
        )}
        {!spaceId && spacesContext && (
          <>
            <Button
              key="New Document"
              onClick={(e) => {
                setAnchorElDocument(e.currentTarget)
              }}
              sx={{ my: 2, color: 'white' }}
            >
              <EditOutlinedIcon sx={{ mr: '0.2rem' }} />
              New Document
              <ChevronRightIcon sx={{ transform: 'rotate(90deg)' }} />
            </Button>
            <Menu
              sx={{ mt: '45px' }}
              id="document-menu-appbar"
              anchorEl={anchorElDocument}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElDocument)}
              onClose={() => setAnchorElDocument(null)}
            >
              <Divider key="new-document-divider">
                <Typography variant="body2">SELECT TARGET SPACE</Typography>
              </Divider>
              {Array.from(spacesContext.spaces).map((space) => {
                return (
                  <MenuItem
                    key={`document-menu-${space.id}`}
                    href={newDocumentPath(space.id)}
                    onClick={(e) => {
                      e.preventDefault()
                      router.push(newDocumentPath(space.id)).then()
                      setAnchorElDocument(null)
                    }}
                  >
                    <ListItemIcon>
                      <WorkspacesIcon sx={{ mr: '0.4rem' }} />
                    </ListItemIcon>
                    <Typography
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {space.name}
                    </Typography>
                  </MenuItem>
                )
              })}
            </Menu>
          </>
        )}
      </Box>
    </>
  )
}

const MobileScreenMenu = ({ spaceId }: { spaceId?: SpaceId }): JSX.Element => {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null)
  const router = useRouter()
  return (
    <>
      {/* Hamburger for smaller screen */}
      <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={(e) => setAnchorElNav(e.currentTarget)}
          color="inherit"
        >
          <MenuIcon />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorElNav}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          open={Boolean(anchorElNav)}
          onClose={() => setAnchorElNav(null)}
          sx={{
            display: { xs: 'block', md: 'none' },
          }}
        >
          <MenuItem
            key="home-timeline"
            onClick={(e) => {
              e.preventDefault()
              setAnchorElNav(null)
              router.push('/').then()
            }}
          >
            <Typography>Home</Typography>
          </MenuItem>
          <MenuItem
            key="home-edited"
            onClick={(e) => {
              e.preventDefault()
              setAnchorElNav(null)
              router.push('/edited').then()
            }}
          >
            <Typography>Edited</Typography>
          </MenuItem>
          <MenuItem
            key="home-visited"
            onClick={(e) => {
              e.preventDefault()
              setAnchorElNav(null)
              router.push('/visited').then()
            }}
          >
            <Typography>Visited History</Typography>
          </MenuItem>
          <MenuItem
            key="home-starred"
            onClick={() => {
              setAnchorElNav(null)
              router.push('/starred').then()
            }}
          >
            <Typography>Starred</Typography>
          </MenuItem>
          <Divider key="home-divider" />
          {/* TODO Add space list */}
          <MenuItem
            key="Spaces"
            onClick={(e) => {
              e.preventDefault()
              setAnchorElNav(null)
              router.push(documentBase).then()
            }}
          >
            <Typography>Spaces</Typography>
          </MenuItem>
          <MenuItem
            key="New Space"
            onClick={(e) => {
              e.preventDefault()
              setAnchorElNav(null)
              router.push(newSpacePath).then()
            }}
          >
            <Typography>New Space</Typography>
          </MenuItem>
          {spaceId && [
            <Divider key="space-divider" />,
            <MenuItem
              key="Documents"
              onClick={(e) => {
                e.preventDefault()
                setAnchorElNav(null)
                router.push(spaceBase(spaceId)).then()
              }}
            >
              <Typography>Documents</Typography>
            </MenuItem>,
            <MenuItem
              key="New Document"
              onClick={(e) => {
                e.preventDefault()
                setAnchorElNav(null)
                router.push(newDocumentPath(spaceId)).then()
              }}
            >
              <Typography>New Document</Typography>
            </MenuItem>,
            <Divider key="document-divider" />,
            <MenuItem
              key="Search"
              onClick={(e) => {
                e.preventDefault()
                setAnchorElNav(null)
                router.push(searchPath(spaceId)).then()
              }}
            >
              <Typography>Search</Typography>
            </MenuItem>,
          ]}
        </Menu>
      </Box>
    </>
  )
}

const UserMenu = (): JSX.Element => {
  const { data, status } = useSession()
  const isLoggedIn = Boolean(data && status == 'authenticated')
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null)
  return (
    <>
      {!isLoggedIn && (
        <Button
          onClick={(e) => {
            e.preventDefault()
            signIn()
          }}
          color="inherit"
        >
          Login
        </Button>
      )}
      {isLoggedIn && (
        <Box sx={{ flexGrow: 0 }}>
          <Tooltip title="Open settings">
            <IconButton onClick={(e) => setAnchorElUser(e.currentTarget)} sx={{ p: 0 }}>
              <Avatar alt={data?.user?.name ?? ''} src={data?.user?.image ?? ''} />
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: '45px' }}
            id="user-menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElUser)}
            onClose={() => setAnchorElUser(null)}
          >
            <MenuItem key="name" disabled>
              <Typography>{data?.user?.name}</Typography>
            </MenuItem>
            <MenuItem key="email" disabled>
              <Typography>{data?.user?.email}</Typography>
            </MenuItem>
            <Divider key="logout-divider" />
            <MenuItem
              key="logout"
              onClick={(e) => {
                e.preventDefault()
                setAnchorElUser(null)
                signOut().then()
              }}
            >
              <LogoutIcon sx={{ mr: 1 }} />
              <Typography>Logout</Typography>
            </MenuItem>
          </Menu>
        </Box>
      )}
    </>
  )
}

export default TopNavi
