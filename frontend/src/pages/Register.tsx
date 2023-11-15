import { FormControl } from '@mui/base';
import StyledInput from '../components/Input/StyledInput';
import { Button, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';

function Register(): JSX.Element {
  const theme = useTheme();
  const secondaryTextColor = theme.palette.text.secondary;
  return (
    <>
      <div className="flex justify-center items-center flex-col">
        <h2 className="text-5xl font-extrabold py-20 text-secondary">Sign up for Cardflow</h2>
        <FormControl defaultValue="" required>
          <StyledInput placeholder="Email Address" id="email-address" />
        </FormControl>
        <FormControl defaultValue="" required>
          <StyledInput placeholder="Password" id="password" type="password" />
        </FormControl>
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
            Sign Up
          </Button>
        </div>
        <div className="flex justify-center items-center flex-col py-5">
          <p className="font-extrabold">
            Already have an account?{' '}
            <Link to={'/login'} style={{ fontWeight: 'normal' }}>
              Log in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Register;
