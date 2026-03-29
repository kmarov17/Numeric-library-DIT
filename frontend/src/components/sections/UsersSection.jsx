import { motion as Motion } from 'framer-motion'
import { Plus, PencilIcon, UserRoundCog } from 'lucide-react'
import PaginationBar from '../PaginationBar'
import { getUserInitials, roleMeta } from '../../utils/library'

function UsersSection({
  isActive,
  paginatedUsers,
  currentUser,
  currentUserId,
  canManageUsers,
  selectedUserId,
  onSelectUser,
  onStartUserEdition,
  onToggleUserForm,
  showUserForm,
  userPage,
  userPageCount,
  onUserPageChange,
  avatarMotion,
}) {
  const displayedUsers = canManageUsers ? paginatedUsers : currentUser ? [currentUser] : []

  return (
    <section className={isActive ? 'panel visible' : 'panel'}>
      <div className="panel-heading">
        <div>
          <h2 className="section-title"><UserRoundCog size={22} /> {canManageUsers ? 'Gestion des profils' : 'Mon profil'}</h2>
        </div>
        {canManageUsers ? (
          <button className="primary-button" type="button" onClick={onToggleUserForm}>
            <Plus size={16} />
            {showUserForm ? 'Fermer' : 'Nouvel utilisateur'}
          </button>
        ) : null}
      </div>

      <div className="section-stack">
        {displayedUsers.length ? (
          <div className="profile-grid">
            {displayedUsers.map((user) => {
              const meta = roleMeta(user.type)
              const RoleIcon = meta.icon
              const canEditUser = canManageUsers && user.id !== currentUserId

              return (
                <button
                  key={user.id}
                  type="button"
                  className={selectedUserId === user.id || !canManageUsers ? 'profile-tile active' : 'profile-tile'}
                  onClick={() => {
                    if (canManageUsers) {
                      onSelectUser(user.id)
                    }
                  }}
                >
                  <div className="profile-avatar-wrap">
                    <Motion.div
                      className="profile-avatar"
                      variants={avatarMotion}
                      initial="rest"
                      animate="rest"
                      whileHover="hover"
                    >
                      {getUserInitials(user)}
                    </Motion.div>
                    <span
                      className={user.status === 'Actif' ? 'profile-status-dot active' : 'profile-status-dot inactive'}
                    />
                  </div>

                  <div className="profile-name-block">
                    <span className="profile-name">
                      {user.firstName} {user.lastName}
                    </span>
                    <span className="profile-pill">{user.program}</span>
                  </div>

                  <div className="profile-info-card">
                    <div className="profile-info-row">
                      <span className={`timeline-avatar ${meta.theme}`}>
                        <RoleIcon size={18} />
                      </span>
                      <div>
                        <small>Type</small>
                        <strong>{meta.label}</strong>
                      </div>
                    </div>
                    <div className="profile-info-row">
                      <span className="timeline-avatar student">
                        <UserRoundCog size={18} />
                      </span>
                      <div>
                        <small>Email</small>
                        <strong>{user.email}</strong>
                      </div>
                    </div>
                  </div>

                  {canEditUser ? (
                    <div className="profile-actions">
                      <button
                        type="button"
                        className="edit-action"
                        onClick={(event) => {
                          event.stopPropagation()
                          onStartUserEdition(user)
                        }}
                      >
                        <PencilIcon size={15} />
                      </button>
                    </div>
                  ) : null}
                </button>
              )
            })}
          </div>
        ) : (
          <div className="empty-state-panel">
            <p className="muted-text">Aucun utilisateur</p>
          </div>
        )}
        {canManageUsers ? <PaginationBar page={userPage} pageCount={userPageCount} onChange={onUserPageChange} /> : null}
      </div>
    </section>
  )
}

export default UsersSection
