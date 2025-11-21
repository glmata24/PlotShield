import { Link } from 'react-router-dom'

function HistoryPage() {
  return (
    <main>
      <header>
        <h1>Reading History</h1>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/search">Search</Link></li>
            <li><Link to="/favorites">Favorites</Link></li>
          </ul>
        </nav>
      </header>

      <section>
        <h2>Recent Activity</h2>
        <p>
          This section will list recently viewed, rated, or bookmarked books, based on
          client-side history tracking.
        </p>
      </section>

      <section>
        <h2>Filters</h2>
        <p>
          Future work will add filters by event type and date range, as well as clear-all and
          remove-item actions.
        </p>
      </section>
    </main>
  )
}

export default HistoryPage
