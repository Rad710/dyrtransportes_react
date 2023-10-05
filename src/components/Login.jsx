import { AvatarIcon } from '@radix-ui/react-icons';
import { Button } from '@radix-ui/themes'
import netlifyIdentity from 'netlify-identity-widget'

const Login = () => {
  const handleLogin = () => {
    // Open the login/signup modal
    netlifyIdentity.open()
  };

  return (
    <div>
      <h1>Login Page</h1>
      <Button onClick={handleLogin}>Log In</Button>
    </div>
  );
};

export default Login;
