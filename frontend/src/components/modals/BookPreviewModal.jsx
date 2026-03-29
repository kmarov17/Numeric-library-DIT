import { BookOpen, Boxes, CalendarDays, Clock3, FileText, HashIcon, ScrollText, UserRoundPenIcon, X } from 'lucide-react'
import { formatDisplayDate, getBookImageSrc } from '../../utils/library'

function BookPreviewModal({ book, borrowCountByBookId, onClose }) {
  if (!book) {
    return null
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal-shell book-preview-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="book-preview-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="book-preview-header">
          <button className="ghost-button book-preview-close" type="button" onClick={onClose}>
            <X size={16} />
          </button>
          <h3 id="book-preview-title">{book.title}</h3>
        </div>

        <div className="book-preview-grid">
          <div className="book-preview-cover">
            <img
              src={getBookImageSrc(book)}
              alt={book.title}
              onError={(event) => {
                event.currentTarget.src = '/book-placeholder.svg'
              }}
            />
          </div>

          <div className="book-preview-details">
            <div className="book-detail-row">
              <span className="book-detail-icon"><UserRoundPenIcon size={18} /></span>
              <div className="book-detail-copy">
                <small>Auteur</small>
                <span>{book.author}</span>
              </div>
            </div>
            <div className="book-detail-row">
              <span className="book-detail-icon"><BookOpen size={18} /></span>
              <div className="book-detail-copy">
                <small>ISBN</small>
                <span>{book.isbn}</span>
              </div>
            </div>
            <div className="book-detail-row">
              <span className="book-detail-icon"><Boxes size={18} /></span>
              <div className="book-detail-copy">
                <small>Stock</small>
                <span>{book.stock > 0 ? `${book.stock} exemplaire(s)` : 'En rupture'}</span>
              </div>
            </div>
            <div className="book-detail-row">
              <span className="book-detail-icon"><CalendarDays size={18} /></span>
              <div className="book-detail-copy">
                <small>Publication</small>
                <span>{formatDisplayDate(book.publishedDate ?? book.published_date)}</span>
              </div>
            </div>
            <div className="book-detail-row">
              <span className="book-detail-icon"><FileText size={18} /></span>
              <div className="book-detail-copy">
                <small>Pages</small>
                <span>{book.pages ? `${book.pages} page(s)` : '-'}</span>
              </div>
            </div>
            <div className="book-detail-row">
              <span className="book-detail-icon"><Clock3 size={18} /></span>
              <div className="book-detail-copy">
                <small>Emprunts</small>
                <span>{borrowCountByBookId[book.id] ?? 0}</span>
              </div>
            </div>
            <div className="book-detail-row">
              <span className="book-detail-icon"><HashIcon size={18} /></span>
              <div className="book-detail-copy">
                <small>Catégories</small>
                <span>{(book.categories ?? []).length ? book.categories.join(', ') : 'Aucune catégorie'}</span>
              </div>
            </div>
            <div className="book-detail-row">
              <span className="book-detail-icon"><ScrollText size={18} /></span>
              <div className="book-detail-copy">
                <small>Ajouté le</small>
                <span>{formatDisplayDate(book.createdAt ?? book.created_at)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="book-preview-description">
          <h4>Synopsis</h4>
          <p>{book.description || 'Aucune description disponible pour ce livre'}</p>
        </div>
      </div>
    </div>
  )
}

export default BookPreviewModal
