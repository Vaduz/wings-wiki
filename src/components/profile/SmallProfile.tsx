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

const menus = [
  {
    name: 'Timeline',
    path: '/',
    icon: <ViewTimelineOutlinedIcon />,
  },
  {
    name: 'Edited',
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
    <Card sx={{ pt: 3 }}>
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
        {Array.from(menus).map((menu) => {
          return (
            <ListItem disablePadding key={menu.path}>
              <ListItemButton onClick={() => router.push(menu.path).then()} selected={router.pathname === menu.path}>
                <ListItemIcon>{menu.icon}</ListItemIcon>
                <ListItemText primary={menu.name} />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>
    </Card>
  )
}

export default SmallProfile
