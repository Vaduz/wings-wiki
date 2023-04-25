import dynamic from 'next/dynamic'
import { CircularProgress, Paper } from '@mui/material'
import React from 'react'

const EditorLoader = dynamic(() => import('./CustomCKEditor'), {
  ssr: false,
  loading: () => <CircularProgress />,
})

export interface EditorProps {
  content: string
  disabled: boolean
}
export const Editor = (props: EditorProps) => {
  return (
    <Paper>
      <EditorLoader content={props.content} disabled={props.disabled} />
    </Paper>
  )
}
