import TopNavi from '@/components/global/topNavi'
import React, { useState } from 'react'
import { createSpaceApi, CreateSpaceRequest } from '@/lib/api/space'
import { useRouter } from 'next/router'
import logger from '@/lib/logger/pino'
import { spaceBase } from '@/components/global/link'
import { Container, Grid, TextField } from '@mui/material'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

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
            <Typography variant="h2">Create a new space</Typography>
          </Grid>
          <Grid item>
            <TextField
              id="name"
              label="name"
              variant="outlined"
              fullWidth
              margin="normal"
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              id="description"
              label="Description"
              variant="outlined"
              fullWidth
              margin="normal"
              onChange={(e) => setDescription(e.target.value)}
            />
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
