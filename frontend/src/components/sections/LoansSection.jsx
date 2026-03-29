import { AlertCircle, ArrowLeftRight, CheckCircle2, Clock3, Plus, RotateCcw } from 'lucide-react'
import PaginationBar from '../PaginationBar'
import { formatDisplayDate } from '../../utils/library'

function LoansSection({
  isActive,
  canManageLoans,
  paginatedLoans,
  onToggleLoanForm,
  showLoanForm,
  onOpenReturnDialog,
  loanPage,
  loanPageCount,
  onLoanPageChange,
}) {
  return (
    <section className={isActive ? 'panel visible' : 'panel'}>
      <div className="panel-heading">
        <div>
          <h2 className="section-title"><ArrowLeftRight size={22} /> Suivi des emprunts et retours</h2>
        </div>
        {canManageLoans ? (
          <button className="primary-button" type="button" onClick={onToggleLoanForm}>
            <Plus size={16} />
            {showLoanForm ? 'Fermer' : 'Nouvel emprunt'}
          </button>
        ) : null}
      </div>

      <div className="section-stack">
        <div className="table-card">
          <table className="loan-table">
            <thead>
              <tr>
                <th>Livre</th>
                <th>Utilisateur</th>
                <th>Dates</th>
                <th>Notes</th>
                <th>Statut</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLoans.length ? (
                paginatedLoans.map((loan) => (
                  <tr key={loan.id}>
                    <td className="loan-book-cell">
                      <div className="loan-text-block">
                        <strong>{loan.bookTitle}</strong>
                      </div>
                    </td>
                    <td className="loan-user-cell">
                      <div className="loan-text-block">
                        <strong>{loan.userName}</strong>
                      </div>
                    </td>
                    <td className="loan-dates-cell">
                      <div className="loan-date-stack">
                        <span className="loan-date-label">Emprunté le</span>
                        <strong>{formatDisplayDate(loan.borrowedAt)}</strong>
                        <span className="loan-date-label">Retour prévu</span>
                        <span>{formatDisplayDate(loan.dueDate)}</span>
                      </div>
                    </td>
                    <td className="loan-notes-cell">
                      <div className="loan-notes-block">
                        {loan.notes ? <span>{loan.notes}</span> : <span className="muted-text">Aucune note</span>}
                      </div>
                    </td>
                    <td className="loan-status-cell">
                      <span
                        className={
                          loan.returnedAt
                            ? 'badge success'
                            : loan.overdue
                              ? 'badge danger'
                              : 'badge coral'
                        }
                      >
                        {loan.returnedAt ? <CheckCircle2 size={14} /> : loan.overdue ? <AlertCircle size={14} /> : <Clock3 size={14} />}
                        {loan.returnedAt ? 'Retourné' : loan.overdue ? 'En retard' : 'Emprunté'}
                      </span>
                    </td>
                    <td className="loan-action-cell">
                      {canManageLoans && !loan.returnedAt ? (
                        <div className="loan-action-wrap">
                          <button
                            type="button"
                            className="loan-return-button"
                            onClick={() => onOpenReturnDialog(loan)}
                          >
                            <RotateCcw size={15} />
                            Retourner
                          </button>
                        </div>
                      ) : loan.returnedAt ? (
                        <span className="muted-text loan-returned-at">{formatDisplayDate(loan.returnedAt)}</span>
                      ) : (
                        <span className="muted-text loan-returned-at">Lecture</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="empty-row">
                    Aucun emprunt
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <PaginationBar page={loanPage} pageCount={loanPageCount} onChange={onLoanPageChange} />
      </div>
    </section>
  )
}

export default LoansSection
