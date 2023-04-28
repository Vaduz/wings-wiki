import { Chip } from '@mui/material'
import PublicIcon from '@mui/icons-material/Public'
import LockIcon from '@mui/icons-material/Lock'
import QuestionMarkIcon from '@mui/icons-material/QuestionMark'
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined'

const VisibilityChip = ({ visibility }: { visibility: number }): JSX.Element => {
  return (
    <Chip
      avatar={visibilityIcon(visibility)}
      label={visibilityLabel(visibility)}
      key={`visibility-chip-${visibility}`}
      variant="outlined"
    />
  )
}

export const visibilityLabel = (visibility: number): string => {
  switch (visibility) {
    case 1:
      return 'Public'
    case 2:
      return 'Private'
    case 3:
      return 'Protected'
    default:
      return 'Unknown'
  }
}

export const visibilityIcon = (visibility: number): JSX.Element => {
  switch (visibility) {
    case 1:
      return <PublicIcon />
    case 2:
      return <LockIcon />
    case 3:
      return <RemoveRedEyeOutlinedIcon />
    default:
      return <QuestionMarkIcon />
  }
}

export default VisibilityChip
