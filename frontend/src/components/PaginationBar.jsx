function PaginationBar({ page, pageCount, onChange }) {
  if (pageCount <= 1) {
    return null
  }

  return (
    <div className="pagination-bar">
      <button type="button" className="ghost-button" onClick={() => onChange(page - 1)} disabled={page === 1}>
        Precedent
      </button>
      <span className="pagination-label">
        Page {page} sur {pageCount}
      </span>
      <button type="button" className="ghost-button" onClick={() => onChange(page + 1)} disabled={page === pageCount}>
        Suivant
      </button>
    </div>
  )
}

export default PaginationBar
