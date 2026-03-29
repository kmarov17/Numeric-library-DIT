import { Plus, X } from 'lucide-react'

function LoanFormModal({
  visible,
  loanForm,
  books,
  users,
  onChange,
  onSubmit,
  onClose,
}) {
  if (!visible) {
    return null
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div className="modal-shell" role="dialog" aria-modal="true" aria-labelledby="loan-modal-title" onClick={(event) => event.stopPropagation()}>
        <form className="data-form inline-form modal-form" onSubmit={onSubmit}>
          <div className="form-heading">
            <h3 id="loan-modal-title" className="inline-icon">
              <Plus size={18} />
              Enregistrer un emprunt
            </h3>
            <button className="ghost-button" type="button" onClick={onClose}>
              <X size={16} />
              Annuler
            </button>
          </div>

          <label>
            <span>Livre</span>
            <select required value={loanForm.bookId} onChange={(event) => onChange('bookId', event.target.value)}>
              <option value="">Choisir un livre</option>
              {books.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.title}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Utilisateur</span>
            <select required value={loanForm.userId} onChange={(event) => onChange('userId', event.target.value)}>
              <option value="">Choisir un utilisateur</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.firstName} {user.lastName}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Date d'emprunt</span>
            <input type="date" required value={loanForm.borrowedAt} onChange={(event) => onChange('borrowedAt', event.target.value)} />
          </label>
          <label>
            <span>Date limite de retour</span>
            <input type="date" required value={loanForm.dueDate} onChange={(event) => onChange('dueDate', event.target.value)} />
          </label>

          <button className="primary-button" type="submit">
            Valider l'emprunt
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoanFormModal
