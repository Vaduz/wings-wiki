import dynamic from 'next/dynamic'

const EditorLoader = dynamic(() => import('./CustomCKEditor'), {
  ssr: false,
  loading: () => <p>Loading Editor ...</p>,
})

export interface EditorProps {
  content: string
  disabled: boolean
}
export const Editor = (props: EditorProps) => {
  return (
    <>
      <EditorLoader content={props.content} disabled={props.disabled} />
    </>
  )
}
