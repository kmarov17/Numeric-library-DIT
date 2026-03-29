import { useState } from 'react'
import { ArrowRight, BookOpen, Eye, EyeOff, LockKeyhole, Moon, ShieldCheck, Sun } from 'lucide-react'

function AuthLanding({
  authForm,
  authPending,
  theme,
  onToggleTheme,
  onChange,
  onLogin,
}) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <section className="landing-shell">
      <div className="landing-hero">
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
        <br/>
        <h1>Emprunter, suivre et administrer la bibliothèque du DIT depuis une seule interface</h1>

        <div className="landing-feature-grid">
          <article className="landing-feature-card">
            <BookOpen size={20} />
            <strong>Catalogue unifié</strong>
          </article>
          <article className="landing-feature-card">
            <ShieldCheck size={20} />
            <strong>Accès securisé</strong>
          </article>
          <article className="landing-feature-card">
            <ArrowRight size={20} />
            <strong>Suivi des flux</strong>
          </article>
        </div>
      </div>

      <div className="auth-card">
        <div className="auth-heading">
          <LockKeyhole size={18} />
          <span>Connexion</span>
        </div>

        <form className="auth-form" onSubmit={onLogin}>

          <label>
            <span>Email</span>
            <input
              required
              type="email"
              value={authForm.email}
              onChange={(event) => onChange('email', event.target.value)}
            />
          </label>

          <label>
            <span>Mot de passe</span>
            <div className="password-field">
              <input
                required
                type={showPassword ? 'text' : 'password'}
                value={authForm.password}
                onChange={(event) => onChange('password', event.target.value)}
              />
              <button
                type="button"
                className="password-toggle"
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                onClick={() => setShowPassword((current) => !current)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>

          <button className="primary-button auth-submit" type="submit" disabled={authPending}>
            {authPending ? 'Traitement...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </section>
  )
}

export default AuthLanding
