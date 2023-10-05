import netlifyIdentity from 'netlify-identity-widget';
import { useEffect } from 'react';

const LoginPage = () => {

  useEffect(() => {
    netlifyIdentity.open("login")
  }, [])

  return (
    <div className='bg-gray-400'>
    </div>
  );
};

export default LoginPage;
