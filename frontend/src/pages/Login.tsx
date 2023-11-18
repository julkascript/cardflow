import StyledInput from '../components/Input/StyledInput';
import { Button, FormGroup, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';

function Login(): JSX.Element {
  const theme = useTheme();
  const secondaryTextColor = theme.palette.text.secondary;
  return (
    <>
      <div className="flex justify-center items-center flex-col">
        <h2 className="text-5xl font-extrabold py-20 text-secondary">Log in to Cardflow</h2>
        <FormGroup>
          <StyledInput placeholder="Email Address" id="email-address" />
          <StyledInput placeholder="Password" id="password" type="password" />
          <div className="flex justify-center items-center flex-col">
            <Button
              color="secondary"
              variant="contained"
              sx={{
                fontWeight: 'bold',
                backgroundColor: `${secondaryTextColor}`,
                textTransform: 'none',
              }}
            >
              Sign In
            </Button>
          </div>
          <div className="flex justify-center items-center flex-col py-5">
            <p className="font-extrabold">
              Don't have an account?{' '}
              <Link
                to={'/signup'}
                style={{
                  fontWeight: 'normal',
                  color: 'skyblue',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                }}
              >
                Sign Up
              </Link>
            </p>
          </div>
        </FormGroup>
      </div>
    </>
  );
}

export default Login;
