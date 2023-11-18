import { Button, useTheme } from '@mui/material';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import StyledInput from '../components/Input/StyledInput';

function Register(): JSX.Element {
  function handleSubmitRegistration(event: React.FormEvent) {
    event.preventDefault();
    const formData = {
      email: emailRef.current?.value,
      password: passwordRef.current?.value,
    };
    console.log(formData);
  }

  const theme = useTheme();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const secondaryTextColor = theme.palette.text.secondary;
  return (
    <>
      <form onSubmit={handleSubmitRegistration}>
        <div className="flex justify-center items-center flex-col">
          <h2 className="text-5xl font-extrabold py-20 text-secondary">Sign up for Cardflow</h2>
          <StyledInput placeholder="Email Address" id="email-address" inputRef={emailRef} />
          <StyledInput placeholder="Password" type="password" inputRef={passwordRef} />
          <div className="flex justify-center items-center flex-col">
            <Button
              type="submit"
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
              <Link
                to={'/login'}
                style={{
                  fontWeight: 'normal',
                  color: 'skyblue',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                }}
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </form>
    </>
  );
}

export default Register;
