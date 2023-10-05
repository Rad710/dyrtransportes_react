import netlifyIdentity from 'netlify-identity-widget';
import { Button, Theme } from '@radix-ui/themes';
import { FileIcon, PersonIcon } from '@radix-ui/react-icons';

const LoginPage = () => {

  return (

    <Theme
      accentColor="indigo"
      grayColor="gray"
      radius="medium"
    >
      <div className='bg-gray-200 w-full h-screen items-center justify-center flex scale-150 gap-8 flex-col'>
        <Button color="indigo" variant="solid" size="4"
          onClick={() => netlifyIdentity.open("login")}
        >
          <PersonIcon width="20" height="20" />Iniciar Sesión
        </Button>

        <Button color="indigo" variant="solid" size="4"
          onClick={() => netlifyIdentity.open("signup")}
        >
          <FileIcon width="20" height="20" />Crear Cuenta
        </Button>
      </div>
    </Theme>

  );
};

export default LoginPage;
