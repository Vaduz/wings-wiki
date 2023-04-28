import { useState } from 'react'
import { createSpaceApi } from '@/lib/api/space'
import { useRouter } from 'next/router'
import logger from '@/lib/logger/pino'
import { spaceBase } from '@/components/global/WingsLink'
import {
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from '@mui/material'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { CreateSpaceRequest } from '@/lib/types/apiRequest'
import { LayoutBase } from '@/components/layout/Layout'

const NewSpace = (): JSX.Element => {
  const [name, setName] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [members, setMembers] = useState<string[]>([])
  const [language, setLanguage] = useState<string>('en')
  const [visibility, setVisibility] = useState<string>('1')
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
    <LayoutBase>
      <Container>
        <Grid container direction="column" rowSpacing={2} pt={2}>
          <Grid item>
            <Typography variant="h2">New space</Typography>
          </Grid>
          <Grid item>
            <Paper>
              <TextField
                id="name"
                label="Space Name"
                variant="outlined"
                fullWidth
                autoFocus
                onChange={(e) => setName(e.target.value)}
              />
            </Paper>
          </Grid>
          <Grid item>
            <Paper>
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
            <FormControl>
              <InputLabel id="language-select-label">Language</InputLabel>
              <Select
                labelId="language-select-label"
                id="language-select"
                value={language}
                label="Language"
                onChange={(e) => setLanguage(e.target.value)}
              >
                <MenuItem value={'en'}>English</MenuItem>
                <MenuItem value={'ja'}>Japanese</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            <FormControl>
              <Paper sx={{ px: 2, py: 1 }}>
                <FormLabel id="visibility-radio-label">Visibility</FormLabel>
                <RadioGroup
                  row
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value)}
                  aria-labelledby="visibility-radio-label"
                  name="visibility-radio-group"
                >
                  <FormControlLabel value="1" control={<Radio />} label="Public" />
                  <FormControlLabel value="2" disabled control={<Radio />} label="Private" />
                </RadioGroup>
              </Paper>
            </FormControl>
          </Grid>
          <Grid item>
            <Button variant="contained" onClick={createButtonHandler}>
              Create
            </Button>
          </Grid>
        </Grid>
      </Container>
    </LayoutBase>
  )
}

export default NewSpace
