interface Props {
  page: number
  total: number
  perPage: number
  onPage: (p: number) => void
}

export default function Pagination({ page, total, perPage, onPage }: Props) {
  const pages = Math.max(1, Math.ceil(total / perPage))
  if (pages <= 1) return null
  return (
    <div className="row" style={{ justifyContent: 'center', marginTop: '.5rem' }}>
      <button className="button" disabled={page<=1} onClick={()=>onPage(page-1)}>Prev</button>
      <span className="badge">Hal {page} / {pages}</span>
      <button className="button" disabled={page>=pages} onClick={()=>onPage(page+1)}>Next</button>
    </div>
  )
}
