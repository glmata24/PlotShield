import { Link } from 'react-router-dom'

function TagsPage() {
  return (
    <main>
      <header>
        <h1>Age Group & Reading Level Tagging</h1>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/search">Search</Link></li>
            <li><Link to="/favorites">Favorites</Link></li>
          </ul>
        </nav>
      </header>

      <section>
        <h2>Tag Management</h2>
        <p>
          This section will eventually provide tools to view and manage age group and reading
          level tags for books.
        </p>
      </section>

      <section>
        <h2>Display & Filters</h2>
        <p>
          The PRD calls for displaying these tags on book details and cards, and allowing search
          to filter by age group and level.
        </p>
      </section>
    </main>
  )
}

export default TagsPage
