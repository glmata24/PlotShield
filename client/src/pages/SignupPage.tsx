import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../auth/supabaseClient'
import { useAuth } from '../auth/AuthProvider'

function SignupPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  if (user) {
    return (
      <main>
        <header>
          <h1>Sign up</h1>
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
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (signUpError) {
        throw signUpError
      }

      navigate('/account', { replace: true })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to sign up.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main>
      <header>
        <h1>Sign up</h1>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/login">Log in</Link>
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
              autoComplete="new-password"
              required
            />
          </label>

          {error && <p>{error}</p>}

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Signing up...' : 'Create account'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default SignupPage
