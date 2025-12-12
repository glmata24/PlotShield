import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

type Recommendation = {
  recommendationId: string
  bookId: string
}

function RecommendationsPage() {
  const [userIdInput, setUserIdInput] = useState('')
  const [userId, setUserId] = useState('')
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const apiBaseUrl = useMemo(
    () => {
      const raw = import.meta.env.VITE_API_BASE_URL as string | undefined
      if (!raw) return undefined
      const trimmed = raw.replace(/\/+$/, '')
      return trimmed.endsWith('/v1') ? trimmed : `${trimmed}/v1`
    },
    [],
  )

  useEffect(() => {
    if (!userId) {
      return
    }

    if (!apiBaseUrl) {
      setError('API base URL is not configured (VITE_API_BASE_URL).')
      return
    }

    const controller = new AbortController()

    const run = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(
          `${apiBaseUrl}/recommendations?userId=${userId}`,
          { signal: controller.signal },
        )

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        const data = (await response.json()) as Recommendation[]
        setRecommendations(data)
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return
        }

        setError('Unable to load recommendations. Please check the user ID and try again.')
        setRecommendations([])
      } finally {
        setIsLoading(false)
      }
    }

    run()

    return () => controller.abort()
  }, [apiBaseUrl, userId])

  const handleLoad = () => {
    const trimmed = userIdInput.trim()
    if (!trimmed) return
    setUserId(trimmed)
  }

  return (
    <main>
      <header>
        <h1>Similar Book Recommendations</h1>
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
        <h2>Recommendations for User</h2>
        <p>Enter a user ID to load recommendations.</p>
        <input
          type="text"
          value={userIdInput}
          onChange={(event) => setUserIdInput(event.target.value)}
          placeholder="User ID (UUID)"
          aria-label="User ID"
        />
        <button type="button" onClick={handleLoad}>
          Load recommendations
        </button>
      </section>

      <section>
        <h2>Recommended Books List</h2>
        {isLoading && <p>Loading recommendations...</p>}
        {error && <p>{error}</p>}

        {!isLoading && !error && userId && (
          <div>
            {recommendations.length === 0 ? (
              <p>No recommendations found for this user.</p>
            ) : (
              <ul>
                {recommendations.map((item) => (
                  <li key={item.recommendationId}>
                    Recommendation for book {item.bookId}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </section>
    </main>
  )
}

export default RecommendationsPage
