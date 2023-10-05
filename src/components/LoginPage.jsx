import React from 'react';
import netlifyIdentity from 'netlify-identity-widget';
import { Button } from '@radix-ui/themes';

const LoginPage = () => {
  const handleLogin = () => {
    // Open the login/signup modal
    netlifyIdentity.open();
  };

  return (
    <div>
      <h1>Login Page</h1>
      <button onClick={handleLogin}>Log In</button>
      <Button>Holaaaa</Button>
    </div>
  );
};

export default LoginPage;
