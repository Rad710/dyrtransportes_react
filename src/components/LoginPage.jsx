import netlifyIdentity from 'netlify-identity-widget';
import { Button } from '@radix-ui/themes';
import { FaceIcon, PersonIcon } from '@radix-ui/react-icons';

const LoginPage = () => {

  return (
    <div className='bg-gray-400'>
      <Button color="indigo" variant="solid" size="4"
        onClick={() => netlifyIdentity.open("login")}
      >
        <FaceIcon width="20" height="20" />Iniciar Sesión
      </Button>

      <Button color="indigo" variant="solid" size="4"
        onClick={() => netlifyIdentity.open("signup")}
      >
        <PersonIcon width="20" height="20" />Registrarse
      </Button>
    </div>
  );
};

export default LoginPage;
