import { documentPath } from '../global/link'
import styles from './documentCards.module.scss'
import Link from 'next/link'
import { WingsDocument } from '@/lib/types/es'

interface DocumentCardsProps {
  documents: WingsDocument[]
}
const DocumentCards = (props: DocumentCardsProps) => {
  return (
    <div className="list-group" key="document-list">
      {props.documents.map((document: WingsDocument) => {
        return (
          <div className="card mb-3" key={document.id}>
            <div className={`card-body rounded shadow-sm ${styles.hoverShadow}`}>
              <h5 className="card-title">
                <i className="bi bi-file-earmark-text text-primary" />
                &nbsp;
                <Link href={documentPath(document.id)} className="stretched-link link-dark text-decoration-none">
                  {document.title || '[Empty title]'}
                </Link>
              </h5>
              {/*<h6 className="card-subtitle mb-2 text-muted">Updated by someone</h6>*/}
              {/*<p className="card-text">body snippet here</p>*/}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default DocumentCards
