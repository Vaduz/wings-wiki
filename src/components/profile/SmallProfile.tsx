import {
  Button,
  Card,
  CardContent,
  CardActions,
  ListItem,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Typography,
  Avatar,
  Box,
} from '@mui/material'
import { signIn, useSession } from 'next-auth/react'
import RestoreIcon from '@mui/icons-material/Restore'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import ViewTimelineOutlinedIcon from '@mui/icons-material/ViewTimelineOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { useRouter } from 'next/router'
import React from 'react'
import HomeIcon from '@mui/icons-material/Home'

export const rootMenus = [
  {
    name: 'Home',
    path: '/',
    icon: <HomeIcon />,
  },
  {
    name: 'Timeline',
    path: '/timeline',
    icon: <ViewTimelineOutlinedIcon />,
  },
  {
    name: 'Edited History',
    path: '/edited',
    icon: <EditOutlinedIcon />,
  },
  {
    name: 'Visited History',
    path: '/visited',
    icon: <RestoreIcon />,
  },
  {
    name: 'Starred',
    path: '/starred',
    icon: <StarBorderIcon />,
  },
]

const SmallProfile = (): JSX.Element => {
  const { data, status } = useSession()
  const isLoggedIn = !!(data && status == 'authenticated')
  const router = useRouter()

  return (
    <Box display="flex" justifyContent="center">
      <Card sx={{ minWidth: '300px', maxWidth: '100%' }}>
        <CardContent sx={{ display: 'flex', justifyContent: 'center' }}>
          {isLoggedIn && (
            <Avatar alt={data.user?.name ?? ''} src={data.user?.image ?? ''} sx={{ width: 56, height: 56 }} />
          )}
          {!isLoggedIn && <Avatar sx={{ width: 56, height: 56 }}>G</Avatar>}
        </CardContent>
        <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
          {!isLoggedIn && (
            <Box>
              <Typography textAlign="center">Guest</Typography>
              <Button size="small" onClick={() => signIn()}>
                Login
              </Button>
            </Box>
          )}
          {isLoggedIn && <Typography textAlign="center">{data.user?.name}</Typography>}
        </CardActions>
        <List>
          {Array.from(rootMenus).map((menu) => {
            return (
              <ListItem disablePadding key={menu.path}>
                <ListItemButton
                  href={menu.path}
                  onClick={(e) => {
                    e.preventDefault()
                    router.push(menu.path).then()
                  }}
                  selected={router.pathname === menu.path}
                >
                  <ListItemIcon>{menu.icon}</ListItemIcon>
                  <ListItemText primary={menu.name} />
                </ListItemButton>
              </ListItem>
            )
          })}
        </List>
      </Card>
    </Box>
  )
}

export default SmallProfile
