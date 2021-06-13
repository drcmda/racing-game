import { authenticateUser } from '../data'
import googleLogo from '../icons/google-logo.png'
import githubLogo from '../icons/github-logo.png'
import type { Provider } from '@supabase/supabase-js'

const providers: readonly {
  readonly provider: Provider
  readonly label: string
  readonly logo: string
}[] = [
  {
    provider: 'google',
    label: 'Sign in with Google',
    logo: googleLogo,
  },
  {
    provider: 'github',
    label: 'Sign in with Github',
    logo: githubLogo,
  },
] as const

export function Auth() {
  const signIn = async (provider: Provider) => {
    try {
      await authenticateUser(provider)
    } catch (error) {
      alert(error.error_description || error.message)
    }
  }

  return (
    <div>
      <h2 className="auth-header">Want to save your score?</h2>
      <div className="auth-providers">
        {providers.map(({ provider, label, logo }) => (
          <button key={provider} className="auth-provider" onClick={() => signIn(provider)}>
            <img src={logo} />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
