import React from 'react'
import { EditorProps } from './editor'
import Editor from './ckeditor.cjs'
import { CKEditor } from '@ckeditor/ckeditor5-react'

const CustomCKEditor = (props: EditorProps) => {
  return (
    <CKEditor
      editor={Editor}
      // config={editorConfiguration }
      data={props.content}
      disabled={props.disabled}
      onChange={(event, editor) => {
        const data = editor.getData()
        console.log({ event, editor, data })
      }}
      onReady={(editor: any) => {
        // You can store the "editor" and use when it is needed.
        if (props.disabled) {
          editor.ui.view.toolbar.element.style.display = 'none' // flex to enable
        }
        console.log('Editor is ready to use!', editor)
      }}
    />
  )
}

export default CustomCKEditor
