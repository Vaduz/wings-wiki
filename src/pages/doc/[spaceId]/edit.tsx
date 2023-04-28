import { useEffect, useState } from 'react'
import { getSpaceApi, updateSpaceApi } from '@/lib/api/space'
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
import { UpdateSpaceRequest } from '@/lib/types/apiRequest'
import { LayoutBase } from '@/components/layout/Layout'
import { SpaceId } from '@/lib/types/elasticsearch'

const EditSpace = (): JSX.Element => {
  return (
    <LayoutBase>
      <Container>
        <Grid container direction="column" rowSpacing={2} pt={2}>
          <Grid item>
            <Typography variant="h2">Edit space</Typography>
          </Grid>
          <EditSpaceForms />
        </Grid>
      </Container>
    </LayoutBase>
  )
}

const EditSpaceForms = (): JSX.Element => {
  const router = useRouter()
  const spaceId = router.query.spaceId as SpaceId
  const [name, setName] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [members, setMembers] = useState<string[]>([])
  const [language, setLanguage] = useState<string>('en')
  const [visibility, setVisibility] = useState<number>(1)

  useEffect(() => {
    if (!spaceId) return
    getSpaceApi(spaceId)
      .then((res) => {
        if (!res) return
        setName(res.name)
        setDescription(res.description)
        setMembers(res.members)
        setLanguage(res.language)
        setVisibility(res.visibility)
      })
      .catch((e) => logger.error(e))
      .finally()
  }, [spaceId])

  const updateButtonHandler = () => {
    if (!name) return
    const updateSpaceRequest: UpdateSpaceRequest = {
      id: spaceId,
      name: name,
      description: description,
      members: members,
      visibility: visibility,
    }
    updateSpaceApi(updateSpaceRequest)
      .then((res) => {
        if (!res) {
          logger.error({ message: 'Invalid response from API', request: updateSpaceRequest, res: res })
        } else {
          router.push(spaceBase(res.id)).then()
        }
      })
      .catch((err) => logger.error({ message: 'Failed to create space', request: updateSpaceRequest, err: err }))
  }

  return (
    <>
      <Grid item>
        <Paper>
          <TextField
            id="name"
            label="Space Name"
            variant="outlined"
            fullWidth
            autoFocus
            value={name}
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
            value={description}
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
            value={language ?? 'en'}
            label="Language"
            disabled
          >
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="ja">Japanese</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item>
        <FormControl>
          <Paper sx={{ px: 2, py: 1 }}>
            <FormLabel id="visibility-radio-label">Visibility</FormLabel>
            <RadioGroup
              row
              value={visibility ?? '1'}
              onChange={(e) => setVisibility(Number(e.target.value))}
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
        <Button variant="contained" onClick={updateButtonHandler}>
          Update
        </Button>
      </Grid>
    </>
  )
}

export default EditSpace
