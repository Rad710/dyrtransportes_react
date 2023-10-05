import netlifyIdentity from 'netlify-identity-widget';

const Login = () => {

  return (
    <div className='bg-gray-500'>
      {netlifyIdentity.open()}
    </div>
  );
};

export default Login;
