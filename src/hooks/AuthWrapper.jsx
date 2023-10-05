// AuthWrapper.js
import { useEffect, useState } from 'react'
import netlifyIdentity from 'netlify-identity-widget'

const AuthWrapper = ({ children }) => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Initialize the Netlify Identity widget
    netlifyIdentity.init({
      container: '#netlify-modal', // defaults to document.body
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
      {user ? children : <Login />}
    </>
  )
};

export default AuthWrapper;
