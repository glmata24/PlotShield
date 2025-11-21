import { Link } from 'react-router-dom'

function InsightsPage() {
  return (
    <main>
      <header>
        <h1>AI-Categorized Insights</h1>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/search">Search</Link></li>
            <li><Link to="/recommendations">Similar Books</Link></li>
          </ul>
        </nav>
      </header>

      <section>
        <h2>Themes, Characters, Setting</h2>
        <p>
          This page will visualize structured AI insights for each book, pulled from
          <code>/api/books/:id/insights</code>.
        </p>
      </section>

      <section>
        <h2>Filters</h2>
        <p>
          It will provide filter controls for themes, character development, and setting, with
          loading and error states.
        </p>
      </section>
    </main>
  )
}

export default InsightsPage
