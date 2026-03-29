import { AlertCircle, ArrowLeftRight, BookOpen, Clock3, GraduationCap, Shield, UserRoundCog } from 'lucide-react'

export function normalizeBook(book) {
  const image =
    (typeof book.image === 'string' && book.image.trim()) ||
    (typeof book.coverImage === 'string' && book.coverImage.trim()) ||
    '/book-placeholder.svg'

  const rawCategories = Array.isArray(book.categories)
    ? book.categories
    : typeof book.categories === 'string'
      ? book.categories.split(',').map((item) => item.trim()).filter(Boolean)
      : book.category
        ? [book.category]
        : []

  return {
    ...book,
    id: String(book.id),
    image,
    publishedDate: book.publishedDate ?? book.published_date ?? '',
    description: book.description ?? '',
    categories: rawCategories,
  }
}

export function normalizeUser(user) {
  const rawType = user.type ?? ''
  const normalizedType =
    rawType === 'PERSONNEL ADMINISTRATIF'
      ? 'Personnel administratif'
      : rawType === 'PROFESSEUR'
        ? 'Professeur'
        : rawType === 'ETUDIANT'
          ? 'Etudiant'
          : rawType

  return {
    ...user,
    id: String(user.id),
    firstName: user.firstName ?? user.first_name ?? '',
    lastName: user.lastName ?? user.last_name ?? '',
    type: normalizedType,
    program: user.program ?? user.department ?? '',
    status:
      user.status ??
      (typeof user.is_active === 'boolean'
        ? user.is_active
          ? 'Actif'
          : 'Inactif'
        : 'Actif'),
  }
}

export function normalizeLoan(loan) {
  return {
    ...loan,
    id: String(loan.id),
    bookId: String(loan.bookId ?? loan.book_id ?? ''),
    userId: String(loan.userId ?? loan.user_id ?? ''),
    borrowedAt: loan.borrowedAt ?? loan.borrowed_at ?? loan.loanDate ?? '',
    dueDate: loan.dueDate ?? loan.due_date ?? '',
    returnedAt: loan.returnedAt ?? loan.returned_at ?? null,
    notes: loan.notes ?? '',
  }
}

export function roleMeta(type) {
  if (type === 'Professeur') {
    return { icon: UserRoundCog, label: 'Professeur', theme: 'professor' }
  }

  if (type === 'Personnel administratif') {
    return { icon: Shield, label: 'Administration', theme: 'admin' }
  }

  return { icon: GraduationCap, label: 'Etudiant', theme: 'student' }
}

export function getBookImageSrc(book) {
  const image =
    (typeof book?.image === 'string' && book.image.trim()) ||
    (typeof book?.coverImage === 'string' && book.coverImage.trim())

  return image || '/book-placeholder.svg'
}

export function getUserInitials(user) {
  return [user?.firstName?.[0], user?.lastName?.[0]].filter(Boolean).join('').toUpperCase()
}

export function paginate(items, page, pageSize) {
  const start = (page - 1) * pageSize
  return items.slice(start, start + pageSize)
}

export function formatDisplayDate(value) {
  if (!value) {
    return '-'
  }

  const trimmedValue = String(value).trim()
  const isoMatch = trimmedValue.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (isoMatch) {
    return `${isoMatch[3]}/${isoMatch[2]}/${isoMatch[1]}`
  }

  const date = new Date(trimmedValue)
  if (Number.isNaN(date.getTime())) {
    return trimmedValue
  }

  return date.toLocaleDateString('fr-FR')
}

export function buildStats(books, users, enrichedLoans) {
  const activeLoans = enrichedLoans.filter((loan) => !loan.returnedAt).length
  const delayedLoans = enrichedLoans.filter((loan) => loan.overdue).length

  return [
    {
      label: 'Catalogue actif',
      helper: 'livres',
      value: books.length,
      accent: 'primary',
      icon: BookOpen,
    },
    {
      label: 'Communauté',
      helper: 'utilisateurs',
      value: users.length,
      accent: 'mint',
      icon: GraduationCap,
    },
    {
      label: 'Emprunts',
      helper: 'en cours',
      value: activeLoans,
      accent: 'coral',
      icon: ArrowLeftRight,
    },
    {
      label: 'Vigilance',
      helper: 'retards',
      value: delayedLoans,
      accent: 'danger',
      icon: AlertCircle,
    },
  ]
}

export function enrichLoans(loans, books, users) {
  return loans.map((loan) => {
    const book = books.find((item) => item.id === loan.bookId)
    const user = users.find((item) => item.id === loan.userId)
    const dueValue = String(loan.dueDate ?? '').trim()
    let dueDate = null

    if (dueValue) {
      const dateOnlyMatch = dueValue.match(/^(\d{4})-(\d{2})-(\d{2})$/)
      if (dateOnlyMatch) {
        dueDate = new Date(`${dueValue}T23:59:59`)
      } else {
        const parsed = new Date(dueValue)
        if (!Number.isNaN(parsed.getTime())) {
          // Count the whole due day as valid even when backend sends a full timestamp.
          parsed.setHours(23, 59, 59, 999)
          dueDate = parsed
        }
      }
    }

    const overdue = !loan.returnedAt && dueDate ? dueDate < new Date() : false

    return {
      ...loan,
      overdue,
      bookTitle: book?.title ?? 'Livre inconnu',
      userName: user ? `${user.firstName} ${user.lastName}` : 'Utilisateur inconnu',
    }
  })
}

export function buildMostBorrowedBooks(books, loans) {
  const borrowCounts = loans.reduce((accumulator, loan) => {
    accumulator[loan.bookId] = (accumulator[loan.bookId] ?? 0) + 1
    return accumulator
  }, {})

  return [...books]
    .map((book) => ({
      ...book,
      borrowCount: borrowCounts[book.id] ?? 0,
    }))
    .sort((left, right) => right.borrowCount - left.borrowCount || left.title.localeCompare(right.title))
    .slice(0, 5)
}
