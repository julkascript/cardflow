import { Button, useTheme } from '@mui/material';
import Logo from '../components/logo/Logo';
import { useNavigate } from 'react-router-dom';
import { useAuthenticationStatus } from '../context/user';
import classes from './Home.module.css';

function Home(): JSX.Element {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthenticationStatus();
  const theme = useTheme();
  const secondary = theme.palette.grey['200'];

  return (
    <div className="pt-40 flex justify-center items-center flex-col">
      <div className="flex">
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
      <p className="mt-4 text-center text-neutral-500 text-2xl font-normal font-['Inter']">
        Cardflow provides you with the tools and infrastructure
      </p>
      <p className="text-center text-neutral-500 text-2xl font-normal font-['Inter']">
        to move your cards from A to B.
      </p>
      <div className="flex mt-2 pt-12">
        <div>
          <Button
            variant="contained"
            sx={{
              padding: '10px',
              width: 170,
              textTransform: 'none',
              backgroundColor: 'black',
              height: 47,
            }}
            className="rounded-[7px]"
            startIcon={<Logo color="white" size={20} />}
          >
            Start exploring
          </Button>
        </div>
        <div className={`ml-12 ${classes.buttonContainer}`}>
          {!isAuthenticated && (
            <Button
              onClick={() => navigate('/login')}
              variant="contained"
              sx={{
                fontWeight: 'bold',
                backgroundColor: 'white',
                color: '#666666',
                width: 170,
                padding: '10px',
                textTransform: 'none',
                border: '0.5px solid #666',
                borderRadius: '7px',
                ':hover': {
                  backgroundColor: secondary,
                },
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
