import TopNavi from '@/components/layout/TopNavi'
import { Container, Grid } from '@mui/material'
import React from 'next'
import { ReactNode } from 'react'
import { SpacesContextProvider } from '@/contexts/spaces'
import SmallProfile from '@/components/profile/SmallProfile'
import SmallSpaces from '@/components/space/SmallSpaces'
import WingsBreadcrumbs from './WingsBreadcrumbs'

export const LayoutBase = ({ children }: { children: ReactNode }): JSX.Element => {
  return (
    <SpacesContextProvider>
      <TopNavi />
      <WingsBreadcrumbs />
      {children}
    </SpacesContextProvider>
  )
}

export const Layout = ({
  children,
  menuNames,
  menu,
}: {
  children: ReactNode
  menuNames?: MenuName[]
  menu?: JSX.Element
}): JSX.Element => {
  return (
    <LayoutBase>
      <Grid container>
        <Grid item xs={12} md={4} pt={2}>
          <Container maxWidth="lg">
            {menuNames &&
              Array.from(menuNames).map((menuName) => {
                return (
                  <Grid container key={menuName}>
                    <Grid item xs={12} mb={2}>
                      {getMenu(menuName)}
                    </Grid>
                  </Grid>
                )
              })}
            {menu && menu}
          </Container>
        </Grid>
        <Grid item xs={12} md={8}>
          <Container maxWidth="lg">{children}</Container>
        </Grid>
      </Grid>
    </LayoutBase>
  )
}

export type MenuName = 'smallProfile' | 'smallSpaces'

const getMenu = (menuName: MenuName): JSX.Element => {
  switch (menuName) {
    case 'smallProfile':
      return <SmallProfile />
    case 'smallSpaces':
      return <SmallSpaces />
    default:
      return <></>
  }
}
