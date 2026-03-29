const todayIsoDate = new Date().toISOString().split('T')[0]

export const PAGE_SIZE = 10

export const initialBookForm = {
  title: '',
  author: '',
  publishedDate: todayIsoDate,
  isbn: '',
  pages: 1,
  description: '',
  image: '',
  categories: [],
  stock: 1,
}

export const initialUserForm = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  type: 'ETUDIANT',
  program: '',
  status: 'Actif',
}

export const initialLoanForm = {
  bookId: '',
  userId: '',
  borrowedAt: '',
  dueDate: '',
}

export const categoryOptions = [
  'Informatique',
  'Intelligence artificielle',
  'DevOps',
  'Base de données',
  'Réseaux',
  'Frontend',
  'Backend',
  'Cloud',
  'Cybersecurité',
]

export const programOptions = [
  'Licence Informatique Big Data',
  'Licence Business et Marketing Digital',
  'Master Intelligence Artificielle',
  'Master Finance Digitale',
  'TOEIC Listening & Reading',
  'Data Scientist Intensive',
  'Certification Python Basics',
  'Certification Fullstack Web',
  'Certification Data Manager',
]

export const sections = [
  { id: 'books', label: 'Livres' },
  { id: 'users', label: 'Utilisateurs' },
  { id: 'loans', label: 'Emprunts' },
]

export const avatarMotion = {
  rest: { y: 0, scale: 1, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12)' },
  hover: {
    y: -4,
    scale: 1.03,
    boxShadow: '0 18px 34px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.12)',
    transition: { duration: 0.18, ease: 'easeOut' },
  },
}
