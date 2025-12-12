import { Link } from 'react-router-dom'

function HomePage() {
  return (
    <main>
      <header>
        <h1>PlotShield Library Explorer</h1>
        <nav>
          <ul>
            <li><Link to="/search">Search by Title or Author</Link></li>
            <li><Link to="/reviews-toggle">AI vs Original Reviews</Link></li>
            <li><Link to="/recommendations">Similar Book Recommendations</Link></li>
            <li><Link to="/favorites">Favorites / Bookmarks</Link></li>
            <li><Link to="/ratings">Ratings / Reactions</Link></li>
            <li><Link to="/history">Reading History</Link></li>
            <li><Link to="/tags">Age Group & Reading Level Tagging</Link></li>
          </ul>
        </nav>
      </header>

      <section>
        <h2>Overview</h2>
        <p>
          Use the navigation links above to explore each core feature described in the
          PlotShield PRD and task list.
        </p>
      </section>
    </main>
  )
}

export default HomePage
