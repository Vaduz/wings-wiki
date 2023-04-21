import React from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'
import { documentBase, newDocumentPath, newSpacePath, searchPath, spaceBase } from '@/components/global/link'
import { SpaceId } from '@/lib/types/es'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import MenuIcon from '@mui/icons-material/Menu'
import Container from '@mui/material/Container'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import MenuItem from '@mui/material/MenuItem'
import { useRouter } from 'next/router'

const TopNavi = ({ spaceId }: { spaceId?: SpaceId }): JSX.Element => {
  const { data, status } = useSession()
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null)
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null)
  const router = useRouter()

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }
  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }
  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget)
  }
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Masthead */}
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'Hiragino',
              fontWeight: 700,
              letterSpacing: '.2rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Wings
          </Typography>

          {/* Hamburger for smaller screen */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
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
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              <MenuItem
                key="Spaces"
                onClick={() => {
                  handleCloseNavMenu()
                  router.push(documentBase).then()
                }}
              >
                <Typography textAlign="center">Spaces</Typography>
              </MenuItem>
              <MenuItem
                key="New Space"
                onClick={() => {
                  handleCloseNavMenu()
                  router.push(newSpacePath).then()
                }}
              >
                <Typography textAlign="center">New Space</Typography>
              </MenuItem>
              {spaceId && (
                <>
                  <MenuItem
                    key="Documents"
                    onClick={() => {
                      handleCloseNavMenu()
                      router.push(spaceBase(spaceId)).then()
                    }}
                  >
                    <Typography textAlign="center">Documents</Typography>
                  </MenuItem>
                  <MenuItem
                    key="New Document"
                    onClick={() => {
                      handleCloseNavMenu()
                      router.push(newDocumentPath(spaceId)).then()
                    }}
                  >
                    <Typography textAlign="center">New Document</Typography>
                  </MenuItem>
                  <MenuItem
                    key="Search"
                    onClick={() => {
                      handleCloseNavMenu()
                      router.push(searchPath(spaceId)).then()
                    }}
                  >
                    <Typography textAlign="center">Search</Typography>
                  </MenuItem>
                </>
              )}
            </Menu>
          </Box>

          {/* App bar buttons for regular screen */}
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'Hiragino',
              fontWeight: 700,
              letterSpacing: '.2rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Wings
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button
              href={documentBase}
              key="Spaces"
              onClick={handleCloseNavMenu}
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              Spaces
            </Button>
            <Button
              href={newSpacePath}
              key="New Space"
              onClick={handleCloseNavMenu}
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              New Space
            </Button>
            {spaceId && (
              <>
                <Button
                  href={spaceBase(spaceId)}
                  key="Documents"
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  Documents
                </Button>
                <Button
                  href={newDocumentPath(spaceId)}
                  key="New Document"
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  New Document
                </Button>
                <Button
                  href={searchPath(spaceId)}
                  key="Search"
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  Search
                </Button>
              </>
            )}
          </Box>

          {/* Avatar */}
          {(!data || status != 'authenticated') && (
            <Button onClick={() => signIn()} color="inherit">
              Login
            </Button>
          )}
          {data && status == 'authenticated' && (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt={data.user?.name ?? ''} src={data.user?.image ?? ''} />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
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
                onClose={handleCloseUserMenu}
              >
                <MenuItem key="name" onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{data.user?.name}</Typography>
                </MenuItem>
                <MenuItem key="email" onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{data.user?.email}</Typography>
                </MenuItem>
                <MenuItem
                  key="logout"
                  onClick={() => {
                    handleCloseNavMenu()
                    signOut().then()
                  }}
                >
                  <Typography textAlign="center">logout</Typography>
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default TopNavi
