import { PencilIcon, Plus, X } from 'lucide-react'
import { programOptions } from '../../constants/library'

function UserFormModal({
  visible,
  editingUserId,
  userForm,
  errorMessage,
  onChange,
  onSubmit,
  onClose,
  onReset,
}) {
  if (!visible) {
    return null
  }

  const shouldShowProgram = ['ETUDIANT', 'PROFESSEUR'].includes(userForm.type)

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onClick={() => {
        onReset()
        onClose()
      }}
    >
      <div className="modal-shell" role="dialog" aria-modal="true" aria-labelledby="user-modal-title" onClick={(event) => event.stopPropagation()}>
        <form className="data-form inline-form modal-form" onSubmit={onSubmit}>
          <div className="form-heading">
            <h3 id="user-modal-title" className="inline-icon">
              {editingUserId ? <PencilIcon size={18} /> : <Plus size={18} />}
              {editingUserId ? 'Modifier un utilisateur' : 'Créer un utilisateur'}
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

          <label>
            <span>Prénom</span>
            <input required value={userForm.firstName} onChange={(event) => onChange('firstName', event.target.value)} />
          </label>
          <label>
            <span>Nom</span>
            <input required value={userForm.lastName} onChange={(event) => onChange('lastName', event.target.value)} />
          </label>
          <label>
            <span>Email</span>
            <input type="email" required value={userForm.email} onChange={(event) => onChange('email', event.target.value)} />
          </label>
          <label>
            <span>Mot de passe</span>
            <input
              type="password"
              required
              value={userForm.password}
              onChange={(event) => onChange('password', event.target.value)}
            />
          </label>
          <label>
            <span>Type</span>
            <select value={userForm.type} onChange={(event) => onChange('type', event.target.value)}>
              <option value="ETUDIANT">ETUDIANT</option>
              <option value="PROFESSEUR">PROFESSEUR</option>
              <option value="PERSONNEL ADMINISTRATIF">PERSONNEL ADMINISTRATIF</option>
            </select>
          </label>
          {shouldShowProgram ? (
            <label>
              <span>Filière</span>
              <select required value={userForm.program} onChange={(event) => onChange('program', event.target.value)}>
                <option value="">Choisir une filière</option>
                {programOptions.map((program) => (
                  <option key={program} value={program}>
                    {program}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          <label>
            <span>Statut</span>
            <select value={userForm.status} onChange={(event) => onChange('status', event.target.value)}>
              <option>Actif</option>
              <option>Inactif</option>
            </select>
          </label>

          <button className="primary-button" type="submit">
            {editingUserId ? 'Enregistrer les modifications' : 'Ajouter le profil'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default UserFormModal
