/* eslint-disable @typescript-eslint/quotes */
// TO-DO: fix conflict in ESLint / Prettier rules and remove the above
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../services/user/user';
import {
  SuccessfulAuthenticationResponse,
  UserLogin,
  UserRegister,
} from '../../services/user/types';
import { useCurrentUser } from '../../context/user';
import toast from 'react-hot-toast';
import { toastMessages } from '../../constants/toast';
import { errorToast } from '../../util/errorToast';
import { HttpError } from '../../util/HttpError';
import { Button, Link, TextField } from '@mui/material';

type AuthFormProps = {
  isLogin: boolean;
};

type ErrorProps = {
  username?: string;
  email?: string;
  password?: string;
};

const SignUpPage: React.FC<AuthFormProps> = ({ isLogin }) => {
  const { setUser } = useCurrentUser();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  function handleUsernameChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    const value = event.target.value;
    setUsername(value);
  }

  function handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    const value = event.target.value;
    setPassword(value);
  }

  function handleEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    const value = event.target.value;
    setEmail(value);
  }

  async function authenticaticateUser(id: number, tokens: SuccessfulAuthenticationResponse) {
    localStorage.setItem('accessToken', tokens.access);
    localStorage.setItem('refreshToken', tokens.refresh);
    const data = await userService.getUserById(id);
    setUser({ user_id: id, ...data });
    navigate('/');
    toast.success(isLogin ? toastMessages.success.login : toastMessages.success.register);
  }

  function validate(isLogin: boolean) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (password.trim() === '') {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
    if (username.trim() === '') {
      setUsernameError(true);
    } else {
      setUsernameError(false);
    }
    if (!isLogin) {
      if (email.trim() === '' || !emailRegex.test(email)) {
        setEmailError(true);
      } else {
        setEmailError(false);
      }
    }
  }

  async function handleSubmitAuthForm(event: React.FormEvent) {
    event.preventDefault();
    validate(isLogin);
    try {
      let tokens: SuccessfulAuthenticationResponse;
      const loginData: UserLogin = {
        username,
        password,
      };
      if (isLogin) {
        tokens = await userService.login(loginData);
      } else {
        const formData: UserRegister = {
          email,
          password,
          username,
        };
        tokens = await userService.register(formData);
      }

      const payload = userService.extractUserFromToken(tokens.access);
      await authenticaticateUser(payload.user_id, tokens);
    } catch (error: any) {
      const data = await error.err.json();
      setError(data);
      if (error instanceof HttpError) {
        if (isLogin && error.err.status === 401) {
          errorToast(error, toastMessages.error.failedLogin);
        } else {
          errorToast(error, undefined, 400);
        }
      }
    }
  }

  const navigate = useNavigate();

  const [passwordError, setPasswordError] = React.useState<boolean>(false);
  const [usernameError, setUsernameError] = React.useState<boolean>(false);
  const [emailError, setEmailError] = React.useState<boolean>(false);
  const [error, setError] = React.useState<ErrorProps>({});

  return (
    <form onSubmit={handleSubmitAuthForm}>
      <div className="flex justify-center items-center flex-col">
        <h2 className="text-4xl text-center font-bold pt-20 pb-10 text-secondary">
          {isLogin ? 'Log in' : 'Sign up'} for Cardflow
        </h2>
        <div className="w-full flex justify-center mb-8 lg:mb-4">
          <TextField
            className="w-3/4 lg:w-96"
            placeholder="Username"
            size="small"
            label={usernameError ? error.username : 'Username'}
            id="username"
            error={usernameError}
            onChange={handleUsernameChange}
          />
        </div>
        {!isLogin ? (
          <div className="w-full flex justify-center mb-8 lg:mb-4">
            <TextField
              size="small"
              label={emailError ? error.email : 'Email Address'}
              className="w-3/4 lg:w-96"
              placeholder="Email Address"
              id="email-address"
              error={emailError}
              onChange={handleEmailChange}
            />
          </div>
        ) : null}
        <TextField
          size="small"
          label={passwordError ? error.password : 'Password'}
          className="w-3/4 lg:w-96"
          placeholder="Password"
          type="password"
          error={passwordError}
          onChange={handlePasswordChange}
        />
        <div className="flex items-center flex-col mt-4">
          <Button type="submit" color="primary" variant="contained" size="large">
            {isLogin ? 'Log in' : 'Sign up'}
          </Button>
        </div>
        <div className="flex justify-center items-center flex-col py-5">
          <p className="font-extrabold text-center">
            {/* eslint-disable-next-line quotes */}
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <Link href={isLogin ? '/register' : '/login'} color="#2384F4" underline="hover">
              {isLogin ? 'Sign up' : 'Log in'}
            </Link>
          </p>
        </div>
      </div>
    </form>
  );
};

export default SignUpPage;
