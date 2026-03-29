function StatsGrid({ stats }) {
  return (
    <section className="stats-grid" aria-label="Indicateurs">
      {stats.map((item) => {
        const Icon = item.icon
        return (
          <article key={item.label} className={`stat-card ${item.accent}`}>
            <div className="stat-top">
              <span className="stat-icon">
                <Icon size={18} />
              </span>
              <span className="stat-label">{item.label}</span>
            </div>
            <span>
              <strong>{item.value}</strong>
              <small>{item.helper}</small>
            </span>
          </article>
        )
      })}
    </section>
  )
}

export default StatsGrid
