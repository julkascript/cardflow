import { Button } from '@mui/material';
import Logo from '../components/logo/Logo';
import { useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuthenticationStatus, useCurrentUser } from '../context/user';
import { userService } from '../services/user/user';
import { useEffect } from 'react';

function Home(): JSX.Element {
  const theme = useTheme();
  const secondary = theme.palette.grey['900'];
  const secondaryTextColor = theme.palette.text.secondary;
  const navigate = useNavigate();
  const { setUser } = useCurrentUser();
  const { isAuthenticated } = useAuthenticationStatus();
  useEffect(() => {
    const initializeAuth = async () => {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        const accessToken = await userService.verifySession(refreshToken);
        const user = userService.extractUserFromToken(accessToken);
        setUser(user);
      }
    };

    initializeAuth();
  }, [setUser]);

  return (
    <div className="flex justify-center items-center flex-col">
      <div className="flex">
        <h1 className="text-9xl font-extrabold px-4 py-2 text-secondary">Buy.</h1>
        <h1 className="text-9xl font-extrabold px-4 py-2 text-secondary">Sell.</h1>
        <h1 className="text-9xl font-extrabold px-4 py-2 text-secondary">Trade.</h1>
      </div>
      <p className="text-lg mt-2 font-normal text-inter mt-2" color={secondary}>
        Cardflow provides you with the tools and infrastructure
      </p>
      <p className="text-lg mt-2 font-normal text-inter mt-2" color={secondary}>
        to move your cards from A to B.
      </p>
      <div className="flex mt-2 pt-20">
        <div className="pr-40">
          <Button
            variant="contained"
            sx={{
              padding: '10px',
              width: 210,
              textTransform: 'none',
              backgroundColor: `${secondaryTextColor}`,
            }}
            startIcon={<Logo color="white" size={20} />}
          >
            Start exploring
          </Button>
        </div>
        <div>
          {!isAuthenticated && (
            <Button
              onClick={() => navigate('/login')}
              color="secondary"
              variant="contained"
              sx={{
                fontWeight: 'bold',
                backgroundColor: 'white',
                color: '#666666',
                width: 210,
                padding: '10px',
                textTransform: 'none',
              }}
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
