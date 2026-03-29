import { BookOpen, PencilIcon, Plus, Search, Trash2 } from 'lucide-react'
import PaginationBar from '../PaginationBar'
import { getBookImageSrc } from '../../utils/library'

function BooksSection({
  isActive,
  canManageBooks,
  bookQuery,
  onBookQueryChange,
  onToggleBookForm,
  showBookForm,
  paginatedBooks,
  onSelectBookPreview,
  onStartBookEdition,
  onDeleteBook,
  bookPage,
  bookPageCount,
  onBookPageChange,
}) {
  return (
    <section className={isActive ? 'panel visible' : 'panel'}>
      <div className="panel-heading">
        <div>
          <h2 className="section-title"><BookOpen size={22} /> Gestion du catalogue</h2>
        </div>
        <div className="panel-actions">
          <label className="search-box section-search">
            <span>Recherche</span>
            <div className="search-input-wrap">
              <Search size={18} />
              <input
                type="search"
                value={bookQuery}
                onChange={(event) => onBookQueryChange(event.target.value)}
                placeholder="Titre, auteur ou ISBN"
              />
            </div>
          </label>
        </div>
      </div>

      <div className="section-stack">
        {canManageBooks ? (
          <div className="books-toolbar">
            <button className="primary-button" type="button" onClick={onToggleBookForm}>
              <Plus size={16} />
              {showBookForm ? 'Fermer' : 'Nouveau livre'}
            </button>
          </div>
        ) : null}

        <div className="books-layout">
          <div className="table-card">
            <table className="catalog-table">
              <thead>
                <tr>
                  <th>Titre</th>
                  <th>Auteur</th>
                  <th>ISBN</th>
                  <th>Stock</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedBooks.length ? (
                  paginatedBooks.map((book) => (
                    <tr
                      key={book.id}
                      className="catalog-row-clickable"
                      onClick={() => onSelectBookPreview(book)}
                    >
                      <td>
                        <div className="book-cell">
                          <div className="book-thumb">
                            <img
                              src={getBookImageSrc(book)}
                              alt={book.title}
                              onError={(event) => {
                                event.currentTarget.src = '/book-placeholder.svg'
                              }}
                            />
                          </div>
                          <div className="book-meta">
                            <strong>{book.title}</strong>
                          </div>
                        </div>
                      </td>
                      <td className="catalog-author-cell">
                        <span className="cell-main">{book.author}</span>
                      </td>
                      <td className="catalog-isbn-cell">
                        <span className="cell-code">{book.isbn}</span>
                      </td>
                      <td className="catalog-stock-cell">
                        <span className={book.stock > 0 ? 'badge success' : 'badge danger'}>
                          {book.stock > 0 ? book.stock : 'En rupture'}
                        </span>
                      </td>
                      <td className="catalog-actions-cell">
                        {canManageBooks ? (
                          <div className="action-row">
                            <button
                              type="button"
                              className="edit-action"
                              onClick={(event) => {
                                event.stopPropagation()
                                onStartBookEdition(book)
                              }}
                            >
                              <PencilIcon size={15} />
                            </button>
                            <button
                              type="button"
                              className="delete-action"
                              onClick={(event) => {
                                event.stopPropagation()
                                onDeleteBook(book.id)
                              }}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        ) : <span className="muted-text">Lecture</span>}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="empty-row">
                      Aucun livre
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <PaginationBar page={bookPage} pageCount={bookPageCount} onChange={onBookPageChange} />
        </div>
      </div>
    </section>
  )
}

export default BooksSection
