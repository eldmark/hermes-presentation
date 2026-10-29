import './panels.css'

export function ConceptPanel({ term, greek, gloss, myth }: { term: string; greek: string; gloss: string; myth: string }) {
  return (
    <article className="pn-card">
      <h2 className="pn-term">{term}</h2>
      <p className="pn-greek" lang="grc">{greek}</p>
      <hr className="pn-rule" />
      <p className="pn-gloss">{gloss}</p>
      <p className="pn-myth"><span>En el mito:</span> <em>{myth}</em></p>
    </article>
  )
}
