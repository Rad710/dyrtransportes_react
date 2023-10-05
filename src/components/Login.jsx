import { AvatarIcon } from '@radix-ui/react-icons';
import { Button } from '@radix-ui/themes'
import netlifyIdentity from 'netlify-identity-widget'

const Login = () => {

  return (
    <div className='bg-gray-500'>
      <Button color="indigo" variant="solid" size="4"
        onClick={() => netlifyIdentity.open()}
      >
        <AvatarIcon width="20" height="20" />Iniciar Sesión
      </Button>
    </div>
  );
};

export default Login;
