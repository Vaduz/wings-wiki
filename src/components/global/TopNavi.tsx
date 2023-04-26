import React, { useEffect, useState } from 'react'
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
import { getSpacesApi } from '@/lib/api/space'
import logger from '@/lib/logger/pino'
import WorkspacesIcon from '@mui/icons-material/Workspaces'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import AddIcon from '@mui/icons-material/Add'
import ViewTimelineOutlinedIcon from '@mui/icons-material/ViewTimelineOutlined'
import RestoreIcon from '@mui/icons-material/Restore'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import { Check } from '@mui/icons-material'

const TopNavi = ({ spaceId }: { spaceId?: SpaceId }): JSX.Element => {
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
      onClick={() => router.push('/').then()}
    >
      Wings
    </Typography>
  )
}

const RegularScreenMenu = ({ spaceId }: { spaceId?: SpaceId }): JSX.Element => {
  const router = useRouter()
  const [spaces, setSpaces] = useState<Space[]>()
  const [mySpace, setMySpace] = useState<Space>()
  useEffect(() => {
    getSpacesApi()
      .then((r) => {
        setSpaces(r)
        setMySpace(Array.from(r).find((space) => space.id == spaceId))
      })
      .catch((e) => logger.error({ message: 'global/TopNavi.tsx RegularScreenMenu', error: e }))
  }, [spaceId])
  const [anchorElHome, setAnchorElHome] = useState<null | HTMLElement>(null)
  const [anchorElSpace, setAnchorElSpace] = useState<null | HTMLElement>(null)
  const [anchorElDocument, setAnchorElDocument] = useState<null | HTMLElement>(null)

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
            onClick={() => {
              router.push('/').then()
              setAnchorElHome(null)
            }}
          >
            <Typography sx={{ display: 'flex', alignItems: 'center' }}>
              <ListItemIcon>
                <ViewTimelineOutlinedIcon />
              </ListItemIcon>
              Timeline
            </Typography>
          </MenuItem>
          <MenuItem
            key="root-edited"
            onClick={() => {
              router.push('/edited').then()
              setAnchorElHome(null)
            }}
          >
            <Typography sx={{ display: 'flex', alignItems: 'center' }}>
              <ListItemIcon>
                <EditOutlinedIcon />
              </ListItemIcon>
              Edited
            </Typography>
          </MenuItem>
          <MenuItem
            key="root-visited-history"
            onClick={() => {
              router.push('/visited').then()
              setAnchorElHome(null)
            }}
          >
            <Typography sx={{ display: 'flex', alignItems: 'center' }}>
              <ListItemIcon>
                <RestoreIcon />
              </ListItemIcon>
              Visited History
            </Typography>
          </MenuItem>
          <MenuItem
            key="root-starred"
            onClick={() => {
              router.push('/starred').then()
              setAnchorElHome(null)
            }}
          >
            <Typography sx={{ display: 'flex', alignItems: 'center' }}>
              <ListItemIcon>
                <StarBorderIcon />
              </ListItemIcon>
              Starred
            </Typography>
          </MenuItem>
        </Menu>
        <Button key="Spaces" onClick={(e) => setAnchorElSpace(e.currentTarget)} sx={{ my: 2, color: 'white' }}>
          {
            <>
              <WorkspacesIcon sx={{ mr: '0.4rem' }} />
              {(mySpace && mySpace.name) || 'Space'}
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
            onClick={() => {
              router.push(documentBase).then()
              setAnchorElSpace(null)
            }}
          >
            <Typography>All spaces</Typography>
          </MenuItem>
          <Divider key="space-mangement" />
          {spaces &&
            Array.from(spaces).map((space) => {
              return (
                <MenuItem
                  key={`space-${space.id}`}
                  onClick={() => {
                    router.push(spaceBase(space.id)).then()
                    setAnchorElSpace(null)
                  }}
                >
                  <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                    <ListItemIcon>{(space.id == spaceId && <Check />) || <WorkspacesIcon />}</ListItemIcon>
                    {space.name}
                  </Typography>
                </MenuItem>
              )
            })}
          <Divider key="space-mangement" />
          <MenuItem
            key="new-space"
            onClick={() => {
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
              onClick={() => {
                router.push(newDocumentPath(spaceId)).then()
                setAnchorElSpace(null)
              }}
              sx={{ my: 2, color: 'white' }}
            >
              <EditOutlinedIcon sx={{ mr: '0.2rem' }} />
              New Document
            </Button>
            <Button key="Search" onClick={() => router.push(searchPath(spaceId)).then()} sx={{ my: 2, color: 'white' }}>
              <SearchOutlinedIcon sx={{ mr: '0.2rem' }} />
              Search
            </Button>
          </>
        )}
        {!spaceId && spaces && (
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
              {Array.from(spaces).map((space) => {
                return (
                  <MenuItem
                    key={`document-menu-${space.id}`}
                    onClick={() => {
                      router.push(newDocumentPath(space.id)).then()
                      setAnchorElDocument(null)
                    }}
                  >
                    <Typography
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <ListItemIcon>
                        <WorkspacesIcon sx={{ mr: '0.4rem' }} />
                      </ListItemIcon>
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
            onClick={() => {
              setAnchorElNav(null)
              router.push('/').then()
            }}
          >
            <Typography>Home</Typography>
          </MenuItem>
          <MenuItem
            key="home-edited"
            onClick={() => {
              setAnchorElNav(null)
              router.push('/edited').then()
            }}
          >
            <Typography>Edited</Typography>
          </MenuItem>
          <MenuItem
            key="home-visited"
            onClick={() => {
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
            onClick={() => {
              setAnchorElNav(null)
              router.push(documentBase).then()
            }}
          >
            <Typography>Spaces</Typography>
          </MenuItem>
          <MenuItem
            key="New Space"
            onClick={() => {
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
              onClick={() => {
                setAnchorElNav(null)
                router.push(spaceBase(spaceId)).then()
              }}
            >
              <Typography>Documents</Typography>
            </MenuItem>,
            <MenuItem
              key="New Document"
              onClick={() => {
                setAnchorElNav(null)
                router.push(newDocumentPath(spaceId)).then()
              }}
            >
              <Typography>New Document</Typography>
            </MenuItem>,
            <Divider key="document-divider" />,
            <MenuItem
              key="Search"
              onClick={() => {
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
        <Button onClick={() => signIn()} color="inherit">
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
              onClick={() => {
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
