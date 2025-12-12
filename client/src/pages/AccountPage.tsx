import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../auth/supabaseClient'
import { useAuth } from '../auth/AuthProvider'

function AccountPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const onLogout = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const { error: signOutError } = await supabase.auth.signOut()
      if (signOutError) {
        throw signOutError
      }
      navigate('/', { replace: true })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to log out.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main>
      <header>
        <h1>Account</h1>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/search">Search</Link>
            </li>
          </ul>
        </nav>
      </header>

      <section>
        <h2>Signed in</h2>
        <p>Email: {user?.email ?? 'Unknown'}</p>

        {error && <p>{error}</p>}

        <button type="button" onClick={onLogout} disabled={isLoading}>
          {isLoading ? 'Logging out...' : 'Log out'}
        </button>
      </section>
    </main>
  )
}

export default AccountPage
