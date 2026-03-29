function ReturnDialogModal({ dialog, onChangeNotes, onClose, onConfirm }) {
  if (!dialog) {
    return null
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal-shell confirm-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="return-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="confirm-modal-body">
          <h3 id="return-modal-title">Confirmer le retour</h3>
          <p>Ajoutez une note sur l'état du livre "{dialog.title}".</p>
          <label className="return-notes-field">
            <span>Notes</span>
            <textarea
              rows="4"
              value={dialog.notes}
              onChange={(event) => onChangeNotes(event.target.value)}
              placeholder="Ex: livre rendu en bon état, couverture légèrement usagée..."
            />
          </label>
        </div>
        <div className="confirm-modal-actions">
          <button className="ghost-button" type="button" onClick={onClose}>
            Annuler
          </button>
          <button className="primary-button" type="button" onClick={onConfirm}>
            Confirmer le retour
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReturnDialogModal
