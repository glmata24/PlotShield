import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../auth/supabaseClient'
import { useAuth } from '../auth/AuthProvider'

type LocationState = {
  from?: string
}

function LoginPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const redirectTo = useMemo(() => {
    const state = location.state as LocationState | null
    return state?.from ?? '/account'
  }, [location.state])

  if (user) {
    return (
      <main>
        <header>
          <h1>Login</h1>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/account">Account</Link>
              </li>
            </ul>
          </nav>
        </header>
        <section>
          <p>You are already logged in.</p>
        </section>
      </main>
    )
  }

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        throw signInError
      }

      navigate(redirectTo, { replace: true })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to log in.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main>
      <header>
        <h1>Login</h1>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/signup">Sign up</Link>
            </li>
          </ul>
        </nav>
      </header>

      <section>
        <form onSubmit={onSubmit}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </label>

          {error && <p>{error}</p>}

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Log in'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default LoginPage
