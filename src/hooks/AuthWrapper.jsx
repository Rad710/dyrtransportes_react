// AuthWrapper.js
import { useEffect, useState } from 'react'
import netlifyIdentity from 'netlify-identity-widget'
import LoginPage from '../components/LoginPage';

const AuthWrapper = ({ children }) => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Initialize the Netlify Identity widget
    netlifyIdentity.init({
      locale: 'es' // defaults to 'en'
    })

    // Check the user's authentication status
    const currentUser = netlifyIdentity.currentUser()

    if (currentUser) {
      setUser(currentUser)
    } else {
      // Listen for authentication events
      netlifyIdentity.on('login', (newUser) => {
        setUser(newUser);
      })

      // Listen for sign-up events
      netlifyIdentity.on('signup', (newUser) => {
        setUser(newUser)
      })
    }
  }, [])

  return (
    <>
      {user ? children : <LoginPage />}
    </>
  )
};

export default AuthWrapper;
