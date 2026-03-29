import {
  ChevronDown,
  Image as ImageIcon,
  Layers3,
  Package2,
  Plus,
  Sparkles,
  Type,
  UserRoundPenIcon,
  X,
} from 'lucide-react'
import { categoryOptions } from '../../constants/library'
import { getBookImageSrc } from '../../utils/library'

function BookFormModal({
  visible,
  editingBookId,
  bookForm,
  errorMessage,
  onChange,
  onSubmit,
  onClose,
  onReset,
}) {
  if (!visible) {
    return null
  }

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onClick={() => {
        onReset()
        onClose()
      }}
    >
      <div
        className="modal-shell"
        role="dialog"
        aria-modal="true"
        aria-labelledby="book-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <form className="data-form inline-form modal-form" onSubmit={onSubmit}>
          <div className="form-heading">
            <h3 id="book-modal-title" className="inline-icon">
              {editingBookId ? <Sparkles size={18} /> : <Plus size={18} />}
              {editingBookId ? 'Modifier un livre' : 'Ajouter un livre'}
            </h3>
            <button
              className="ghost-button"
              type="button"
              onClick={() => {
                onReset()
                onClose()
              }}
            >
              <X size={16} />
              Annuler
            </button>
          </div>

          {errorMessage ? <p className="form-error-message">{errorMessage}</p> : null}

          <div className="book-form-layout">
            <div className="book-form-main">
              <div className="book-form-section">
                <div className="book-form-section-head">
                  <Type size={16} />
                  <span>Informations principales</span>
                </div>

                <label>
                  <span>Titre</span>
                  <input
                    required
                    value={bookForm.title}
                    onChange={(event) => onChange('title', event.target.value)}
                    placeholder="Titre du livre"
                  />
                </label>

                <label>
                  <span>Auteur</span>
                  <div className="input-with-icon">
                    <UserRoundPenIcon size={16} />
                    <input
                      required
                      value={bookForm.author}
                      onChange={(event) => onChange('author', event.target.value)}
                      placeholder="Nom de l'auteur"
                    />
                  </div>
                </label>

                <label>
                  <span>ISBN</span>
                  <input
                    required
                    value={bookForm.isbn}
                    onChange={(event) => onChange('isbn', event.target.value)}
                    placeholder="978-..."
                  />
                </label>

                <label>
                  <span>Date de publication</span>
                  <input
                    required
                    type="date"
                    value={bookForm.publishedDate}
                    onChange={(event) => onChange('publishedDate', event.target.value)}
                  />
                </label>

                <label>
                  <span>Nombre de pages</span>
                  <div className="input-with-icon">
                    <Package2 size={16} />
                    <input
                      min="1"
                      type="number"
                      required
                      value={bookForm.pages}
                      onChange={(event) => onChange('pages', Number(event.target.value))}
                    />
                  </div>
                </label>

                <label className="book-form-wide">
                  <span>Description</span>
                  <textarea
                    rows="5"
                    value={bookForm.description}
                    onChange={(event) => onChange('description', event.target.value)}
                    placeholder="Résumé, contexte, points importants..."
                  />
                </label>
              </div>

              <div className="book-form-section">
                <div className="book-form-section-head">
                  <Layers3 size={16} />
                  <span>Classement et disponibilité</span>
                </div>

                <div className="book-form-wide">
                  <span>Catégories</span>
                  <details className="category-dropdown">
                    <summary className="category-trigger">
                      <div className="category-value">
                        {bookForm.categories.length ? (
                          bookForm.categories.map((category) => (
                            <button
                              key={category}
                              type="button"
                              className="selected-chip"
                              onClick={(event) => {
                                event.preventDefault()
                                event.stopPropagation()
                                onChange(
                                  'categories',
                                  bookForm.categories.filter((item) => item !== category),
                                )
                              }}
                            >
                              {category}
                              <span className="chip-close">×</span>
                            </button>
                          ))
                        ) : (
                          <span className="category-placeholder">
                            Choisir une ou plusieurs catégorie(s)
                          </span>
                        )}
                      </div>
                      <span className="category-arrow">
                        <ChevronDown size={16} />
                      </span>
                    </summary>
                    <div className="category-menu">
                      {categoryOptions.map((category) => {
                        const isSelected = bookForm.categories.includes(category)

                        return (
                          <button
                            key={category}
                            type="button"
                            className={isSelected ? 'category-option selected' : 'category-option'}
                            onClick={() =>
                              onChange(
                                'categories',
                                isSelected
                                  ? bookForm.categories.filter((item) => item !== category)
                                  : [...bookForm.categories, category],
                              )
                            }
                          >
                            <span>{category}</span>
                          </button>
                        )
                      })}
                    </div>
                  </details>
                </div>

                <label>
                  <span>Stock</span>
                  <div className="input-with-icon">
                    <Package2 size={16} />
                    <input
                      min="1"
                      type="number"
                      required
                      value={bookForm.stock}
                      onChange={(event) => onChange('stock', Number(event.target.value))}
                    />
                  </div>
                </label>
              </div>
            </div>

            <aside className="book-form-aside">
              <div className="book-form-section">
                <div className="book-form-section-head">
                  <ImageIcon size={16} />
                  <span>Couverture</span>
                </div>

                <label className="book-form-wide">
                  <span>URL de l'image</span>
                  <div className="input-with-icon file-picker">
                    <ImageIcon size={16} />
                    <input
                      type="text"
                      value={bookForm.image}
                      onChange={(event) => onChange('image', event.target.value)}
                      placeholder="https://example.com/cover.jpg"
                    />
                  </div>
                </label>

                <div className="book-cover-preview-card">
                  <div className="image-preview">
                    <img
                      src={getBookImageSrc(bookForm)}
                      alt={bookForm.title || 'Apercu du livre'}
                      onError={(event) => {
                        event.currentTarget.src = '/book-placeholder.svg'
                      }}
                    />
                  </div>

                  <div className="book-cover-preview-meta">
                    <strong>{bookForm.title || 'Titre du livre'}</strong>
                    <span>{bookForm.author || 'Auteur non renseigné'}</span>
                    <small>
                      {bookForm.categories.length
                        ? bookForm.categories.join(' • ')
                        : 'Aucune catégorie'}
                    </small>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          <button className="primary-button" type="submit">
            {editingBookId ? 'Enregistrer les modifications' : 'Ajouter au catalogue'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default BookFormModal
