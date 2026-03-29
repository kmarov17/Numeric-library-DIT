function ConfirmDialogModal({ dialog, onClose }) {
  if (!dialog) {
    return null
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal-shell confirm-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="confirm-modal-body">
          <h3 id="confirm-modal-title">{dialog.title}</h3>
          <p>{dialog.message}</p>
        </div>
        <div className="confirm-modal-actions">
          <button className="ghost-button" type="button" onClick={onClose}>
            Annuler
          </button>
          <button
            className={dialog.tone === 'danger' ? 'danger-button' : 'primary-button'}
            type="button"
            onClick={dialog.onConfirm}
          >
            {dialog.actionLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialogModal
