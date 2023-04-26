import TopNavi from '@/components/global/TopNavi'
import React, { useState } from 'react'
import { createSpaceApi } from '@/lib/api/space'
import { useRouter } from 'next/router'
import logger from '@/lib/logger/pino'
import { spaceBase } from '@/components/global/WingsLink'
import { Container, Grid, Paper, TextField } from '@mui/material'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { CreateSpaceRequest } from '@/lib/types/apiRequest'

const NewSpace = (): JSX.Element => {
  const [name, setName] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [members, setMembers] = useState<string[]>([])
  const router = useRouter()

  const createButtonHandler = () => {
    if (!name) return
    const createSpaceRequest: CreateSpaceRequest = {
      name: name,
      description: description,
      members: members,
      visibility: 1,
    }
    createSpaceApi(createSpaceRequest)
      .then((res) => {
        if (!res) {
          logger.error({ message: 'Invalid response from API', request: createSpaceRequest, res: res })
        } else {
          router.push(spaceBase(res.id)).then()
        }
      })
      .catch((err) => logger.error({ message: 'Failed to create space', request: createSpaceRequest, err: err }))
  }

  return (
    <>
      <TopNavi />
      <Container>
        <Grid container direction="column">
          <Grid item>
            <Typography variant="h2" sx={{ my: 2 }}>
              New space
            </Typography>
          </Grid>
          <Grid item>
            <Paper sx={{ mb: 2 }}>
              <TextField
                id="name"
                label="name"
                variant="outlined"
                fullWidth
                onChange={(e) => setName(e.target.value)}
              />
            </Paper>
            <Paper sx={{ mb: 2 }}>
              <TextField
                id="description"
                label="Description"
                variant="outlined"
                fullWidth
                onChange={(e) => setDescription(e.target.value)}
              />
            </Paper>
          </Grid>
          <Grid item>
            <Button variant="contained" onClick={() => createButtonHandler()}>
              Create
            </Button>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}

export default NewSpace