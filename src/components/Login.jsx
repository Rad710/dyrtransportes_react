import netlifyIdentity from 'netlify-identity-widget';
import { useEffect } from 'react';

const Login = () => {

  useEffect(() => {
    netlifyIdentity.open()
  }, [])

  return (
    <div className='bg-gray-500'>

    </div>
  );
};

export default Login;
