import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

type Favorite = {
  id: string
  title: string
}

const STORAGE_KEY = 'plotshield:favorites'

function FavoritesPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [titleInput, setTitleInput] = useState('')

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw) as Favorite[]
      setFavorites(parsed)
    } catch {
      // ignore malformed data
    }
  }, [])

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
    } catch {
      // ignore storage errors for now
    }
  }, [favorites])

  const handleAdd = () => {
    const trimmed = titleInput.trim()
    if (!trimmed) return
    const newFavorite: Favorite = {
      id: Date.now().toString(),
      title: trimmed,
    }
    setFavorites((current) => [...current, newFavorite])
    setTitleInput('')
  }

  const handleRemove = (id: string) => {
    setFavorites((current) => current.filter((item) => item.id !== id))
  }

  return (
    <main>
      <header>
        <h1>Favorites / Bookmarks</h1>
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
        <h2>Add Favorite</h2>
        <p>Enter a book title to add it to your favorites list on this device.</p>
        <input
          type="text"
          value={titleInput}
          onChange={(event) => setTitleInput(event.target.value)}
          placeholder="Book title"
          aria-label="Book title to favorite"
        />
        <button type="button" onClick={handleAdd}>
          Add to favorites
        </button>
      </section>

      <section>
        <h2>Saved Books</h2>
        {favorites.length === 0 ? (
          <p>No favorites yet.</p>
        ) : (
          <ul>
            {favorites.map((item) => (
              <li key={item.id}>
                <span>{item.title}</span>{' '}
                <button type="button" onClick={() => handleRemove(item.id)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}

export default FavoritesPage
