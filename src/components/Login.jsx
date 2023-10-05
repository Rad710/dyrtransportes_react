// LoginPage.js
import React from 'react';
import netlifyIdentity from 'netlify-identity-widget';

const Login = () => {
  const handleLogin = () => {
    // Open the login/signup modal
    netlifyIdentity.open();
  };

  return (
    <div>
      <h1>Login Page</h1>
      <button onClick={handleLogin}>Log In</button>
    </div>
  );
};

export default Login;
