import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

type Review = {
  reviewId: string
  body: string | null
}

type BookWithSummary = {
  aiReviewSummary: string | null
}

function ReviewsTogglePage() {
  const [bookIdInput, setBookIdInput] = useState('')
  const [bookId, setBookId] = useState('')
  const [mode, setMode] = useState<'original' | 'ai'>('original')
  const [reviews, setReviews] = useState<Review[]>([])
  const [aiSummary, setAiSummary] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const apiBaseUrl = useMemo(
    () => import.meta.env.VITE_API_BASE_URL as string | undefined,
    [],
  )

  useEffect(() => {
    if (!bookId) {
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
        const [reviewsResponse, bookResponse] = await Promise.all([
          fetch(`${apiBaseUrl}/reviews?bookId=${bookId}`, {
            signal: controller.signal,
          }),
          fetch(`${apiBaseUrl}/books/${bookId}`, {
            signal: controller.signal,
          }),
        ])

        if (!reviewsResponse.ok) {
          throw new Error(`Reviews request failed with ${reviewsResponse.status}`)
        }

        if (!bookResponse.ok) {
          throw new Error(`Book request failed with ${bookResponse.status}`)
        }

        const reviewsData = (await reviewsResponse.json()) as Review[]
        const bookData = (await bookResponse.json()) as BookWithSummary

        setReviews(reviewsData)
        setAiSummary(bookData.aiReviewSummary)
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return
        }

        setError('Unable to load review data. Please check the book ID and try again.')
        setReviews([])
        setAiSummary(null)
      } finally {
        setIsLoading(false)
      }
    }

    run()

    return () => controller.abort()
  }, [apiBaseUrl, bookId])

  const handleLoad = () => {
    const trimmed = bookIdInput.trim()
    if (!trimmed) return
    setBookId(trimmed)
  }

  return (
    <main>
      <header>
        <h1>Toggle Between AI-Edited and Original Reviews</h1>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/search">Search</Link>
            </li>
            <li>
              <Link to="/recommendations">Similar Books</Link>
            </li>
          </ul>
        </nav>
      </header>

      <section>
        <h2>Select Book</h2>
        <p>Enter a book ID to view its reviews and AI summary.</p>
        <input
          type="text"
          value={bookIdInput}
          onChange={(event) => setBookIdInput(event.target.value)}
          placeholder="Book ID (UUID)"
          aria-label="Book ID"
        />
        <button type="button" onClick={handleLoad}>
          Load reviews
        </button>
      </section>

      <section>
        <h2>Toggle Control</h2>
        <div>
          <label>
            <input
              type="radio"
              name="review-mode"
              value="original"
              checked={mode === 'original'}
              onChange={() => setMode('original')}
            />{' '}
            Original Reviews
          </label>
          <label>
            <input
              type="radio"
              name="review-mode"
              value="ai"
              checked={mode === 'ai'}
              onChange={() => setMode('ai')}
            />{' '}
            AI Summary
          </label>
        </div>
      </section>

      <section>
        <h2>Content</h2>
        {isLoading && <p>Loading review content...</p>}
        {error && <p>{error}</p>}

        {!isLoading && !error && bookId && (
          <div>
            {mode === 'original' ? (
              <div>
                {reviews.length === 0 ? (
                  <p>No reviews found for this book.</p>
                ) : (
                  <ul>
                    {reviews.map((review) => (
                      <li key={review.reviewId}>
                        <p>{review.body ?? '(No review text provided)'}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <div>
                {aiSummary ? (
                  <p>{aiSummary}</p>
                ) : (
                  <p>No AI summary is available for this book.</p>
                )}
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  )
}

export default ReviewsTogglePage
