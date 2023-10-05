import netlifyIdentity from 'netlify-identity-widget';
import { Button } from '@radix-ui/themes';
import { FileIcon, PersonIcon } from '@radix-ui/react-icons';

const LoginPage = () => {


  return (
    <div className='bg-gray-400'>
      <Theme
        accentColor="indigo"
        grayColor="gray"
        radius="medium"
      >
        <Button color="indigo" variant="solid" size="4"
          onClick={() => netlifyIdentity.open("login")}
        >
          <PersonIcon width="20" height="20" />Iniciar Sesión
        </Button>

        <Button color="indigo" variant="solid" size="4"
          onClick={() => netlifyIdentity.open("signup")}
        >
          <FileIcon width="20" height="20" />Registrarse
        </Button>
      </Theme>
    </div>
  );
};

export default LoginPage;
