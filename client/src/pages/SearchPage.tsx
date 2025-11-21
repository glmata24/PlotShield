import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

type Book = {
  bookId: string
  title: string
  author?: string | null
}

type SearchResult = {
  id: string
  title: string
  author: string
}

function SearchPage() {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const apiBaseUrl = useMemo(
    () => import.meta.env.VITE_API_BASE_URL as string | undefined,
    [],
  )

  useEffect(() => {
    const handle = setTimeout(() => {
      setDebouncedQuery(query)
    }, 300)

    return () => clearTimeout(handle)
  }, [query])

  useEffect(() => {
    if (!apiBaseUrl) {
      setError('API base URL is not configured (VITE_API_BASE_URL).')
      return
    }

    if (debouncedQuery.trim().length < 2) {
      setResults([])
      setError(null)
      setIsLoading(false)
      return
    }

    const controller = new AbortController()
    const run = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const params = new URLSearchParams({
          limit: '50',
          offset: '0',
        })

        const response = await fetch(
          `${apiBaseUrl}/books?${params.toString()}`,
          { signal: controller.signal },
        )

        if (!response.ok) {
          throw new Error(`Search failed with status ${response.status}`)
        }

        const data = (await response.json()) as Book[]

        const normalized = debouncedQuery.trim().toLowerCase()

        const filtered: SearchResult[] = data
          .filter((book) => {
            const inTitle = book.title.toLowerCase().includes(normalized)
            const inAuthor = (book.author ?? '').toLowerCase().includes(normalized)
            return inTitle || inAuthor
          })
          .map((book) => ({
            id: book.bookId,
            title: book.title,
            author: book.author ?? 'Unknown author',
          }))

        setResults(filtered)
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return
        }

        setError('Unable to load search results. Please try again.')
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }

    run()

    return () => controller.abort()
  }, [apiBaseUrl, debouncedQuery])

  const showTooShortMessage =
    query.trim().length > 0 && query.trim().length < 2 && !isLoading

  return (
    <main>
      <header>
        <h1>Search by Title or Author</h1>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/favorites">Favorites</Link>
            </li>
            <li>
              <Link to="/history">Reading History</Link>
            </li>
          </ul>
        </nav>
      </header>

      <section>
        <h2>Search Bar</h2>
        <p>Type at least two characters to search by book title or author.</p>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by title or author..."
          aria-label="Search by book title or author"
        />
        {showTooShortMessage && (
          <p>Enter at least two characters to run a search.</p>
        )}
      </section>

      <section>
        <h2>Search Results</h2>
        {isLoading && <p>Loading results...</p>}
        {error && <p>{error}</p>}

        {!isLoading && !error && debouncedQuery.trim().length >= 2 && (
          <div>
            {results.length === 0 ? (
              <p>No matching books found.</p>
            ) : (
              <ul>
                {results.map((result) => (
                  <li key={result.id}>
                    <div>
                      <strong>{result.title}</strong> by {result.author}
                    </div>
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

export default SearchPage
