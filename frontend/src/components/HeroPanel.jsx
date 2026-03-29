import { ArrowLeftRight, BookOpen, BookX, ChevronLeft, ChevronRight, Moon, Sun, UserRoundCog } from 'lucide-react'

function HeroPanel({
  theme,
  onToggleTheme,
  sections,
  activeSection,
  onSelectSection,
  featuredBook,
  featuredBookImage,
  mostBorrowedBooks,
  safeFeaturedIndex,
  onSelectFeaturedBook,
  onPreviousFeaturedBook,
  onNextFeaturedBook,
}) {
  return (
    <header className="hero-panel">
      <div className="hero-copy">
        <div className="brand-mark">
          <img src="/logo-dit.svg" alt="DIT logo" />
          <span>DIT Library</span>
        </div>
        <button
          type="button"
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-label={theme === 'dark' ? 'Activer le mode clair' : 'Activer le mode sombre'}
          title={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
        </button>
        <div className="hero-ornaments" aria-hidden="true">
          <span className="dot dot-a"></span>
          <span className="dot dot-b"></span>
          <span className="line line-a"></span>
        </div>

        <p className="eyebrow">Projet DevOps DIT 2026</p>
        <h1>DIT Library</h1>
        <p className="hero-text hero-text-italic">La bibliothèque du campus, version grand écran</p>

        <div className="hero-actions">
          {sections.map((section) => (
            <button
              key={section.id}
              className={activeSection === section.id ? 'pill is-active' : 'pill'}
              type="button"
              onClick={() => onSelectSection(section.id)}
            >
              {section.id === 'books' ? <BookOpen size={16} /> : null}
              {section.id === 'users' ? <UserRoundCog size={16} /> : null}
              {section.id === 'loans' ? <ArrowLeftRight size={16} /> : null}
              {section.label}
            </button>
          ))}
        </div>
      </div>

      <aside className="hero-card">
        <div className="hero-card-head">
          <div className="hero-card-icon">
            <BookOpen size={22} />
          </div>
          <div className="hero-card-title">
            <h2>Livres les plus empruntés</h2>
          </div>
        </div>
        {featuredBook ? (
          <div className="featured-book">
            <div className="featured-carousel">
              <button
                type="button"
                className="carousel-arrow left"
                onClick={onPreviousFeaturedBook}
                aria-label="Livre précédent"
              >
                <ChevronLeft size={22} />
              </button>

              <div className="featured-book-media center">
                <img
                  src={featuredBookImage}
                  alt={featuredBook.title}
                  onError={(event) => {
                    event.currentTarget.src = '/book-placeholder.svg'
                  }}
                />
              </div>

              <button
                type="button"
                className="carousel-arrow right"
                onClick={onNextFeaturedBook}
                aria-label="Livre suivant"
              >
                <ChevronRight size={22} />
              </button>
            </div>

            <div className="featured-book-copy">
              <div className="featured-book-meta">
                <h3>{featuredBook.title}</h3>
                <p>{featuredBook.author}</p>
              </div>
              <div className="featured-book-tags">
                {(featuredBook.categories ?? []).slice(0, 3).map((category) => (
                  <span key={category}>{category}</span>
                ))}
              </div>
              <div className="featured-book-foot">
                <small>{featuredBook.borrowCount} emprunt(s)</small>
              </div>
            </div>

            <div className="carousel-dots">
              {mostBorrowedBooks.map((book, index) => (
                <button
                  key={book.id}
                  type="button"
                  className={index === safeFeaturedIndex ? 'carousel-dot active' : 'carousel-dot'}
                  onClick={() => onSelectFeaturedBook(index)}
                  aria-label={`Afficher ${book.title}`}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="hero-empty-state">
            <BookX size={42} />
            <p className="muted-text">Aucun livre disponible</p>
          </div>
        )}
      </aside>
    </header>
  )
}

export default HeroPanel
