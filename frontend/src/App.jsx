import { useEffect, useMemo, useState } from 'react'
import { LogOut, ShieldCheck } from 'lucide-react'
import './App.css'
import HeroPanel from './components/HeroPanel'
import StatsGrid from './components/StatsGrid'
import BooksSection from './components/sections/BooksSection'
import UsersSection from './components/sections/UsersSection'
import LoansSection from './components/sections/LoansSection'
import BookPreviewModal from './components/modals/BookPreviewModal'
import BookFormModal from './components/modals/BookFormModal'
import UserFormModal from './components/modals/UserFormModal'
import LoanFormModal from './components/modals/LoanFormModal'
import ReturnDialogModal from './components/modals/ReturnDialogModal'
import ConfirmDialogModal from './components/modals/ConfirmDialogModal'
import AuthLanding from './components/AuthLanding'
import {
  PAGE_SIZE,
  avatarMotion,
  initialBookForm,
  initialLoanForm,
  initialUserForm,
  sections,
} from './constants/library'
import {
  buildMostBorrowedBooks,
  buildStats,
  enrichLoans,
  getBookImageSrc,
  normalizeBook,
  normalizeLoan,
  normalizeUser,
  paginate,
} from './utils/library'
import {
  clearStoredToken,
  createBook,
  createLoan,
  createUser,
  deleteBook,
  getBooks,
  getCurrentUser,
  getLoans,
  getUsers,
  loginUser,
  returnLoan,
  storeToken,
  updateBook,
  updateUser,
} from './services/api'

const initialAuthForm = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  type: '',
  program: '',
}

function getLoginErrorMessage(error) {
  const rawMessage = String(error?.message ?? '').trim()
  const normalizedMessage = rawMessage.toLowerCase()

  if (
    normalizedMessage.includes('inactive') ||
    normalizedMessage.includes('disabled') ||
    normalizedMessage.includes('not active')
  ) {
    return 'Ce compte est inactif. Veuillez contacter un administrateur.'
  }

  return rawMessage || 'Connexion impossible pour le moment'
}

function App() {
  const [books, setBooks] = useState([])
  const [users, setUsers] = useState([])
  const [loans, setLoans] = useState([])
  const [activeSection, setActiveSection] = useState('books')
  const [bookQuery, setBookQuery] = useState('')
  const [editingBookId, setEditingBookId] = useState(null)
  const [editingUserId, setEditingUserId] = useState(null)
  const [bookForm, setBookForm] = useState(initialBookForm)
  const [userForm, setUserForm] = useState(initialUserForm)
  const [loanForm, setLoanForm] = useState(initialLoanForm)
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [featuredIndex, setFeaturedIndex] = useState(0)
  const [toast, setToast] = useState(null)
  const [showBookForm, setShowBookForm] = useState(false)
  const [showUserForm, setShowUserForm] = useState(false)
  const [showLoanForm, setShowLoanForm] = useState(false)
  const [selectedBookPreview, setSelectedBookPreview] = useState(null)
  const [returnDialog, setReturnDialog] = useState(null)
  const [bookFormError, setBookFormError] = useState('')
  const [userFormError, setUserFormError] = useState('')
  const [theme, setTheme] = useState(() => localStorage.getItem('dit-library-theme') ?? 'dark')
  const [confirmDialog, setConfirmDialog] = useState(null)
  const [bookPage, setBookPage] = useState(1)
  const [userPage, setUserPage] = useState(1)
  const [loanPage, setLoanPage] = useState(1)
  const [authForm, setAuthForm] = useState(initialAuthForm)
  const [authPending, setAuthPending] = useState(false)
  const [sessionPending, setSessionPending] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)

  function notify(tone, message) {
    setToast({
      id: `${Date.now()}-${Math.random()}`,
      tone,
      message,
    })
  }

  function closeConfirmDialog() {
    setConfirmDialog(null)
  }

  function openConfirmDialog(config) {
    setConfirmDialog(config)
  }

  useEffect(() => {
    async function restoreSession() {
      try {
        const me = await getCurrentUser()
        setCurrentUser(normalizeUser(me))
      } catch {
        clearStoredToken()
      } finally {
        setSessionPending(false)
      }
    }

    restoreSession()
  }, [])

  useEffect(() => {
    if (!currentUser) {
      setBooks([])
      setUsers([])
      setLoans([])
      return
    }

    async function hydrate() {
      const [bookResult, userResult, loanResult] = await Promise.allSettled([
        getBooks(),
        getUsers(),
        getLoans(),
      ])

      if (bookResult.status === 'fulfilled') {
        const normalizedBooks = bookResult.value.map(normalizeBook)
        setBooks(normalizedBooks)
        setLoanForm((value) => ({
          ...value,
          bookId: value.bookId || normalizedBooks[0]?.id || '',
        }))
      } else if (![401, 403].includes(bookResult.reason?.status)) {
        notify('danger', bookResult.reason?.message ?? "Erreur lors du chargement des livres")
      }

      if (userResult.status === 'fulfilled') {
        const normalizedUsers = userResult.value.map(normalizeUser)
        setUsers(normalizedUsers)
        setSelectedUserId((value) => value ?? normalizedUsers[0]?.id ?? null)
        setLoanForm((value) => ({
          ...value,
          userId: value.userId || normalizedUsers[0]?.id || '',
        }))
      } else if ([401, 403].includes(userResult.reason?.status)) {
        setUsers(currentUser ? [currentUser] : [])
        setSelectedUserId(currentUser?.id ?? null)
      } else {
        notify('danger', userResult.reason?.message ?? "Erreur lors du chargement des utilisateurs")
      }

      if (loanResult.status === 'fulfilled') {
        setLoans(loanResult.value.map(normalizeLoan))
      } else if (![401, 403].includes(loanResult.reason?.status)) {
        notify('danger', loanResult.reason?.message ?? "Erreur lors du chargement des emprunts")
      } else {
        setLoans([])
      }
    }

    hydrate()
  }, [currentUser])

  useEffect(() => {
    if (!toast) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      setToast(null)
    }, 2800)

    return () => window.clearTimeout(timeoutId)
  }, [toast])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('dit-library-theme', theme)
  }, [theme])

  const filteredBooks = useMemo(() => {
    const query = bookQuery.trim().toLowerCase()
    if (!query) {
      return books
    }

    return books.filter((book) =>
      [book.title, book.author, book.isbn, ...(book.categories ?? [])].some((value) =>
        String(value).toLowerCase().includes(query),
      ),
    )
  }, [books, bookQuery])

  const isAdmin = currentUser?.type === 'Personnel administratif'
  const visibleLoans = useMemo(
    () => (isAdmin ? loans : loans.filter((loan) => loan.userId === currentUser?.id)),
    [currentUser?.id, isAdmin, loans],
  )
  const enrichedLoans = useMemo(() => enrichLoans(visibleLoans, books, users), [visibleLoans, books, users])
  const mostBorrowedBooks = useMemo(() => buildMostBorrowedBooks(books, visibleLoans), [books, visibleLoans])
  const stats = useMemo(() => buildStats(books, users, enrichedLoans), [books, users, enrichedLoans])

  const borrowCountByBookId = useMemo(
    () =>
      mostBorrowedBooks.reduce((accumulator, book) => {
        accumulator[book.id] = book.borrowCount
        return accumulator
      }, {}),
    [mostBorrowedBooks],
  )

  const safeFeaturedIndex = mostBorrowedBooks.length ? featuredIndex % mostBorrowedBooks.length : 0
  const featuredBook = mostBorrowedBooks[safeFeaturedIndex] ?? null
  const featuredBookImage = getBookImageSrc(featuredBook)

  useEffect(() => {
    if (!mostBorrowedBooks.length) {
      return undefined
    }

    const intervalId = window.setInterval(() => {
      setFeaturedIndex((current) => (current + 1) % mostBorrowedBooks.length)
    }, 4500)

    return () => window.clearInterval(intervalId)
  }, [mostBorrowedBooks])

  const paginatedBooks = useMemo(() => paginate(filteredBooks, bookPage, PAGE_SIZE), [filteredBooks, bookPage])
  const paginatedUsers = useMemo(() => paginate(users, userPage, PAGE_SIZE), [users, userPage])
  const paginatedLoans = useMemo(() => paginate(enrichedLoans, loanPage, PAGE_SIZE), [enrichedLoans, loanPage])
  const bookPageCount = Math.max(1, Math.ceil(filteredBooks.length / PAGE_SIZE))
  const userPageCount = Math.max(1, Math.ceil(users.length / PAGE_SIZE))
  const loanPageCount = Math.max(1, Math.ceil(enrichedLoans.length / PAGE_SIZE))

  useEffect(() => {
    setBookPage((current) => Math.min(current, Math.max(1, Math.ceil(filteredBooks.length / PAGE_SIZE))))
  }, [filteredBooks.length])

  useEffect(() => {
    setUserPage((current) => Math.min(current, Math.max(1, Math.ceil(users.length / PAGE_SIZE))))
  }, [users.length])

  useEffect(() => {
    setLoanPage((current) => Math.min(current, Math.max(1, Math.ceil(enrichedLoans.length / PAGE_SIZE))))
  }, [enrichedLoans.length])

  function updateBookForm(field, value) {
    setBookFormError('')
    setBookForm((current) => ({ ...current, [field]: value }))
  }

  function updateUserForm(field, value) {
    setUserForm((current) => {
      if (field === 'type') {
        const shouldKeepProgram = ['ETUDIANT', 'PROFESSEUR'].includes(value)
        return {
          ...current,
          type: value,
          program: shouldKeepProgram ? current.program : '',
        }
      }

      return { ...current, [field]: value }
    })
  }

  function updateLoanForm(field, value) {
    setLoanForm((current) => ({ ...current, [field]: value }))
  }

  function updateAuthForm(field, value) {
    setAuthForm((current) => {
      if (field === 'type') {
        const shouldKeepProgram = ['ETUDIANT', 'PROFESSEUR'].includes(value)
        return {
          ...current,
          type: value,
          program: shouldKeepProgram ? current.program : '',
        }
      }

      return { ...current, [field]: value }
    })
  }

  function resetBookForm() {
    setBookForm(initialBookForm)
    setEditingBookId(null)
    setBookFormError('')
  }

  function resetUserForm() {
    setUserForm(initialUserForm)
    setEditingUserId(null)
    setUserFormError('')
  }

  async function handleLogin(event) {
    event.preventDefault()
    setAuthPending(true)

    try {
      const response = await loginUser({
        email: authForm.email,
        password: authForm.password,
      })
      storeToken(response.access_token)
      const me = await getCurrentUser()
      setCurrentUser(normalizeUser(me))
      setAuthForm(initialAuthForm)
      notify('success', 'Connexion réussie')
    } catch (error) {
      clearStoredToken()
      const message = getLoginErrorMessage(error)
      notify('danger', message)
    } finally {
      setAuthPending(false)
    }
  }

  function handleLogout() {
    clearStoredToken()
    setCurrentUser(null)
    setSelectedBookPreview(null)
    setShowBookForm(false)
    setShowUserForm(false)
    setShowLoanForm(false)
    notify('neutral', 'Session fermée')
  }

  async function handleBookSubmit(event) {
    event.preventDefault()
    setBookFormError('')
    const bookPayload = {
      title: bookForm.title.trim(),
      author: bookForm.author.trim(),
      published_date: bookForm.publishedDate,
      isbn: bookForm.isbn.trim(),
      pages: Number(bookForm.pages),
      description: bookForm.description.trim(),
      image: bookForm.image.trim(),
      categories: bookForm.categories,
      stock: Number(bookForm.stock),
    }

    try {
      if (editingBookId) {
        openConfirmDialog({
          title: 'Enregistrer les modifications',
          message: `Confirmer la mise a jour de "${bookForm.title}" ?`,
          actionLabel: 'Enregistrer',
          tone: 'primary',
          onConfirm: async () => {
            try {
              const updated = await updateBook(editingBookId, bookPayload)
              setBooks((current) =>
                current.map((book) => (book.id === editingBookId ? normalizeBook(updated) : book)),
              )
              resetBookForm()
              setShowBookForm(false)
              notify('success', 'Le livre a bien été mis a jour')
            } catch (error) {
              const message = error.message || 'Échec de la mise a jour du livre'
              setBookFormError(message)
              notify('danger', message)
            } finally {
              closeConfirmDialog()
            }
          },
        })

        return
      }

      const created = await createBook(bookPayload)
      const normalizedCreated = normalizeBook(created)
      setBooks((current) => [normalizedCreated, ...current])
      setLoanForm((current) => ({
        ...current,
        bookId: current.bookId || normalizedCreated.id,
      }))
      notify('success', 'Le livre a bien été ajouté')
      resetBookForm()
      setShowBookForm(false)
    } catch (error) {
      const message = error.message || "Échec de l'ajout du livre"
      setBookFormError(message)
      notify('danger', message)
    }
  }

  function startBookEdition(book) {
    setActiveSection('books')
    setShowBookForm(true)
    setBookForm({
      title: book.title,
      author: book.author,
      publishedDate: book.publishedDate ?? book.published_date ?? '',
      isbn: book.isbn,
      pages: book.pages ?? 1,
      description: book.description ?? '',
      image: book.image ?? '',
      categories: book.categories ?? [],
      stock: book.stock,
    })
    setEditingBookId(book.id)
  }

  async function handleBookDelete(id) {
    const book = books.find((item) => item.id === id)
    openConfirmDialog({
      title: 'Supprimer le livre',
      message: `Voulez-vous vraiment supprimer "${book?.title ?? 'ce livre'}" ?`,
      actionLabel: 'Supprimer',
      tone: 'danger',
      onConfirm: async () => {
        try {
          await deleteBook(id)
          setBooks((current) => current.filter((bookItem) => bookItem.id !== id))
          setLoans((current) => current.filter((loan) => loan.bookId !== id))
          if (editingBookId === id) {
            resetBookForm()
          }
          notify('success', 'Le livre a bien été supprimé')
        } catch {
          notify('danger', 'Suppression impossible')
        } finally {
          closeConfirmDialog()
        }
      },
    })
  }

  async function handleUserSubmit(event) {
    event.preventDefault()
    setUserFormError('')
    const userPayload = {
      first_name: userForm.firstName.trim(),
      last_name: userForm.lastName.trim(),
      email: userForm.email.trim(),
      password: userForm.password,
      type: userForm.type,
      is_active: userForm.status === 'Actif',
      program:
        ['ETUDIANT', 'PROFESSEUR'].includes(userForm.type)
          ? userForm.program
          : userForm.program || 'Administration',
    }

    try {
      if (editingUserId) {
        const updated = await updateUser(editingUserId, userPayload)
        const normalizedUpdated = normalizeUser(updated)
        setUsers((current) =>
          current.map((user) => (user.id === editingUserId ? normalizedUpdated : user)),
        )
        setSelectedUserId(normalizedUpdated.id)
      } else {
        const created = await createUser(userPayload)
        const normalizedCreated = normalizeUser(created)
        setUsers((current) => [normalizedCreated, ...current])
        setSelectedUserId(normalizedCreated.id)
        setLoanForm((current) => ({
          ...current,
          userId: current.userId || normalizedCreated.id,
        }))
      }

      resetUserForm()
      setShowUserForm(false)
      notify('success', editingUserId ? 'Le profil a bien été mis a jour' : 'Le profil a bien été ajouté')
    } catch (error) {
      const fallback = editingUserId ? 'Échec de la mise a jour du profil' : "Échec de l'ajout du profil"
      setUserFormError(error.message || fallback)
      notify('danger', error.message || fallback)
    }
  }

  function startUserEdition(user) {
    setUserForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: '',
      type: user.type,
      program: user.program,
      status: user.status ?? 'Actif',
    })
    setEditingUserId(user.id)
    setShowUserForm(true)
  }

  async function handleLoanSubmit(event) {
    event.preventDefault()
    const loanPayload = {
      book_id: loanForm.bookId,
      user_id: loanForm.userId,
      borrowed_at: `${loanForm.borrowedAt}T00:00:00`,
      due_date: `${loanForm.dueDate}T00:00:00`,
    }

    try {
      const created = await createLoan(loanPayload)
      setLoans((current) => [normalizeLoan(created), ...current])
      notify('success', "L'emprunt a bien été enregistré")
      setLoanForm((current) => ({ ...current, borrowedAt: '', dueDate: '' }))
      setShowLoanForm(false)
    } catch {
      notify('danger', "Échec de l'enregistrement de l'emprunt")
    }
  }

  function openReturnDialog(loan) {
    setReturnDialog({
      id: loan.id,
      title: loan.bookTitle,
      notes: loan.notes ?? '',
    })
  }

  async function handleLoanReturn() {
    if (!returnDialog) {
      return
    }

    try {
      const updated = await returnLoan(returnDialog.id, { notes: returnDialog.notes })
      setLoans((current) =>
        current.map((loan) => (loan.id === returnDialog.id ? normalizeLoan(updated) : loan)),
      )
      setReturnDialog(null)
      notify('success', 'Le retour du livre a bien été confirmé')
    } catch {
      notify('danger', 'Retour impossible')
    }
  }

  function showPreviousFeaturedBook() {
    if (!mostBorrowedBooks.length) {
      return
    }

    setFeaturedIndex((current) => (current === 0 ? mostBorrowedBooks.length - 1 : current - 1))
  }

  function showNextFeaturedBook() {
    if (!mostBorrowedBooks.length) {
      return
    }

    setFeaturedIndex((current) => (current + 1) % mostBorrowedBooks.length)
  }

  function toggleBookForm() {
    if (!showBookForm) {
      resetBookForm()
    }
    setShowBookForm((current) => !current)
  }

  function toggleUserForm() {
    if (!showUserForm) {
      resetUserForm()
    }
    setShowUserForm((current) => !current)
  }

  function toggleLoanForm() {
    setShowLoanForm((current) => !current)
  }

  if (sessionPending) {
    return (
      <div className="app-shell app-shell-centered">
        <div className="auth-card auth-card-compact">
          <h2>Chargement de votre espace</h2>
          <p className="auth-helper">Vérification de la session en cours...</p>
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return (
      <div className="app-shell">
        {toast ? <div className={`toast-notice ${toast.tone}`}>{toast.message}</div> : null}
        <AuthLanding
          authForm={authForm}
          authPending={authPending}
          theme={theme}
          onToggleTheme={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
          onChange={updateAuthForm}
          onLogin={handleLogin}
        />
      </div>
    )
  }

  return (
    <div className="app-shell">
      {toast ? <div className={`toast-notice ${toast.tone}`}>{toast.message}</div> : null}

      <section className="session-banner">
        <div className="session-banner-copy">
          <p className="backend-status-eyebrow">Session active</p>
          <h2>{currentUser.firstName} {currentUser.lastName}</h2>
          <span className="session-meta">
            <ShieldCheck size={16} />
            {currentUser.type}
          </span>
        </div>
        <button className="ghost-button" type="button" onClick={handleLogout}>
          <LogOut size={16} />
          Déconnexion
        </button>
      </section>

      <HeroPanel
        theme={theme}
        onToggleTheme={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
        sections={sections}
        activeSection={activeSection}
        onSelectSection={setActiveSection}
        featuredBook={featuredBook}
        featuredBookImage={featuredBookImage}
        mostBorrowedBooks={mostBorrowedBooks}
        safeFeaturedIndex={safeFeaturedIndex}
        onSelectFeaturedBook={setFeaturedIndex}
        onPreviousFeaturedBook={showPreviousFeaturedBook}
        onNextFeaturedBook={showNextFeaturedBook}
      />

      <StatsGrid stats={stats} />

      <main className="content-grid">
        <BooksSection
          isActive={activeSection === 'books'}
          canManageBooks={isAdmin}
          bookQuery={bookQuery}
          onBookQueryChange={setBookQuery}
          onToggleBookForm={toggleBookForm}
          showBookForm={showBookForm}
          paginatedBooks={paginatedBooks}
          onSelectBookPreview={setSelectedBookPreview}
          onStartBookEdition={startBookEdition}
          onDeleteBook={handleBookDelete}
          bookPage={bookPage}
          bookPageCount={bookPageCount}
          onBookPageChange={setBookPage}
        />

        <UsersSection
          isActive={activeSection === 'users'}
          paginatedUsers={paginatedUsers}
          currentUser={currentUser}
          currentUserId={currentUser?.id ?? null}
          canManageUsers={isAdmin}
          selectedUserId={selectedUserId}
          onSelectUser={setSelectedUserId}
          onStartUserEdition={startUserEdition}
          onToggleUserForm={toggleUserForm}
          showUserForm={showUserForm}
          userPage={userPage}
          userPageCount={userPageCount}
          onUserPageChange={setUserPage}
          avatarMotion={avatarMotion}
        />

        <LoansSection
          isActive={activeSection === 'loans'}
          canManageLoans={isAdmin}
          paginatedLoans={paginatedLoans}
          onToggleLoanForm={toggleLoanForm}
          showLoanForm={showLoanForm}
          onOpenReturnDialog={openReturnDialog}
          loanPage={loanPage}
          loanPageCount={loanPageCount}
          onLoanPageChange={setLoanPage}
        />
      </main>

      <BookPreviewModal
        book={selectedBookPreview}
        borrowCountByBookId={borrowCountByBookId}
        onClose={() => setSelectedBookPreview(null)}
      />

      <BookFormModal
        visible={showBookForm}
        editingBookId={editingBookId}
        bookForm={bookForm}
        errorMessage={bookFormError}
        onChange={updateBookForm}
        onSubmit={handleBookSubmit}
        onClose={() => setShowBookForm(false)}
        onReset={resetBookForm}
      />

      <UserFormModal
        visible={showUserForm}
        editingUserId={editingUserId}
        userForm={userForm}
        errorMessage={userFormError}
        onChange={updateUserForm}
        onSubmit={handleUserSubmit}
        onClose={() => setShowUserForm(false)}
        onReset={resetUserForm}
      />

      <LoanFormModal
        visible={showLoanForm}
        loanForm={loanForm}
        books={books}
        users={users}
        onChange={updateLoanForm}
        onSubmit={handleLoanSubmit}
        onClose={() => setShowLoanForm(false)}
      />

      <ReturnDialogModal
        dialog={returnDialog}
        onChangeNotes={(value) => setReturnDialog((current) => (current ? { ...current, notes: value } : current))}
        onClose={() => setReturnDialog(null)}
        onConfirm={handleLoanReturn}
      />

      <ConfirmDialogModal dialog={confirmDialog} onClose={closeConfirmDialog} />
    </div>
  )
}

export default App
