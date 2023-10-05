// AuthWrapper.js
import React, { useEffect, useState } from 'react';
import netlifyIdentity from 'netlify-identity-widget';
import Login from '../components/Login';

const AuthWrapper = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Initialize the Netlify Identity widget
    netlifyIdentity.init();

    // Check the user's authentication status
    const currentUser = netlifyIdentity.currentUser();

    if (currentUser) {
      setUser(currentUser);
    } else {
      // Listen for authentication events
      netlifyIdentity.on('login', (newUser) => {
        setUser(newUser);
      });
    }
  }, []);

  return <>{user ? children : <Login />}</>;
};

export default AuthWrapper;
