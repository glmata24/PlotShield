import { useState } from 'react'
import { Link } from 'react-router-dom'

function RatingsPage() {
  const [rating, setRating] = useState<number | null>(null)

  const handleSelect = (value: number) => {
    setRating(value)
  }

  return (
    <main>
      <header>
        <h1>Ratings / Reactions</h1>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/search">Search</Link>
            </li>
            <li>
              <Link to="/history">Reading History</Link>
            </li>
          </ul>
        </nav>
      </header>

      <section>
        <h2>Rating Component</h2>
        <p>Select a rating from 1 to 5 to represent your reaction.</p>
        <div>
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => handleSelect(value)}
              aria-pressed={rating === value}
            >
              {value}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2>Current Selection</h2>
        {rating == null ? (
          <p>No rating selected yet.</p>
        ) : (
          <p>You selected a rating of {rating} out of 5.</p>
        )}
      </section>
    </main>
  )
}

export default RatingsPage
