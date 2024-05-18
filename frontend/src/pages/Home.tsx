import { Button, useTheme } from '@mui/material';
import Logo from '../components/logo/Logo';
import { useAuthenticationStatus } from '../context/user';
import classes from './Home.module.css';

function Home(): JSX.Element {
  const { isAuthenticated } = useAuthenticationStatus();
  const theme = useTheme();
  const secondary = theme.palette.grey['200'];

  return (
    <div className="mt-12 lg:pt-40 pb-4 flex justify-center items-center flex-col">
      <div className="flex flex-col text-center lg:flex-row">
        <h1 className={`text-7xl font-extrabold pl-4 py-2 text-secondary ${classes.firstWordText}`}>
          Buy.
        </h1>
        <h1
          className={`text-7xl font-extrabold pl-4 py-2 text-secondary ${classes.secondWordText}`}
        >
          Sell.
        </h1>
        <h1 className={`text-7xl font-extrabold pl-4 py-2 text-secondary ${classes.thirdWordText}`}>
          Trade.
        </h1>
      </div>
      <p className="mt-4 text-center text-neutral-500 text-2xl font-normal">
        Cardflow provides you with the tools and infrastructure
      </p>
      <p className="text-center text-neutral-500 text-2xl font-normal">
        to move your cards from A to B.
      </p>
      <div className="flex gap-8 mt-2 pt-12 flex-col lg:flex-row items-center">
        <div className="hidden lg:block">
          <Button
            variant="contained"
            sx={{
              padding: '10px',
              width: 170,
              textTransform: 'none',
              backgroundColor: 'black',
              height: 47,
            }}
            startIcon={<Logo color="white" size={20} />}
            href="/buy"
          >
            Start exploring
          </Button>
        </div>
        <div className="block lg:hidden">
          <Button
            variant="contained"
            sx={{
              padding: '24px',
              fontSize: 16,
              textTransform: 'none',
              backgroundColor: 'black',
              height: 60,
            }}
            startIcon={<Logo color="white" size={25} />}
            href="/buy"
          >
            Start exploring
          </Button>
        </div>
        <div className={`hidden lg:block ${classes.buttonContainer}`}>
          {!isAuthenticated && (
            <Button
              href="/login"
              variant="contained"
              sx={{
                fontWeight: 'bold',
                backgroundColor: 'white',
                color: '#666666',
                width: 170,
                padding: '10px',
                textTransform: 'none',
                border: '0.5px solid #666',
                ':hover': {
                  backgroundColor: secondary,
                },
                height: 47,
              }}
              className="hover:bg-gray-200"
            >
              Sign In
            </Button>
          )}
        </div>
        <div className={`block lg:hidden ${classes.buttonContainer}`}>
          {!isAuthenticated && (
            <Button
              href="/login"
              variant="contained"
              sx={{
                fontWeight: 'bold',
                backgroundColor: 'white',
                color: '#666666',
                width: 170,
                padding: '24px',
                fontSize: 16,
                textTransform: 'none',
                border: '0.5px solid #666',
                ':hover': {
                  backgroundColor: secondary,
                },
                height: 60,
              }}
              className="hover:bg-gray-200"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
