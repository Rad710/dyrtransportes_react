import { useEffect } from 'react';

import netlifyIdentity from 'netlify-identity-widget'

const Login = () => {

  useEffect(() => {
    netlifyIdentity.open()
  }, [])

  return (
    <div className='bg-gray-400'>
    </div>
  );
};

export default Login;
