import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
    if (passwordRef.current === null || passwordRef.current!.value.trim() === '') {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
    if (usernameRef.current === null || usernameRef.current!.value.trim() === '') {
      setUsernameError(true);
    } else {
      setUsernameError(false);
    }
    if (!isLogin) {
      if (
        usernameRef.current === null ||
        emailRef.current!.value.trim() === '' ||
        !emailRegex.test(emailRef.current!.value)
      ) {
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
        username: usernameRef.current!.value,
        password: passwordRef.current!.value,
      };
      if (isLogin) {
        tokens = await userService.login(loginData);
      } else {
        const formData: UserRegister = {
          email: emailRef.current!.value,
          password: passwordRef.current!.value,
          username: usernameRef.current!.value,
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
  const emailRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [passwordError, setPasswordError] = React.useState<boolean>(false);
  const [usernameError, setUsernameError] = React.useState<boolean>(false);
  const [emailError, setEmailError] = React.useState<boolean>(false);
  const [error, setError] = React.useState<ErrorProps>({});

  return (
    <form onSubmit={handleSubmitAuthForm}>
      <div className="flex justify-center items-center flex-col">
        <h2 className="text-4xl font-bold pt-20 pb-10 text-secondary">
          {isLogin ? 'Log in' : 'Sign up'} for Cardflow
        </h2>
        <input
          className={`w-96 h-8 p-4 mb-4 bg-white rounded-md border ${
            usernameError && 'border-red-500'
          } border-primary-border`}
          placeholder="Username"
          id="username"
          ref={usernameRef}
        />
        {error.username && <p className="text-red-500">{error.username}</p>}
        {!isLogin ? (
          <input
            className={`w-96 h-8 p-4 mb-4 bg-white rounded-md border border-primary-border ${
              emailError && 'border-red-500'
            }`}
            placeholder="Email Address"
            id="email-address"
            ref={emailRef}
          />
        ) : null}
        {error.email && <p className="text-red-500">{error.email}</p>}
        <input
          className={`w-96 h-8 p-4 bg-white rounded-md border border-primary-border ${
            passwordError && 'border-red-500'
          }`}
          placeholder="Password"
          type="password"
          ref={passwordRef}
        />
        {error.password && <p className="text-red-500">{error.password}</p>}
        <div className="flex items-center flex-col mt-4">
          <button type="submit" className="bg-[#171717] text-white py-1 px-4 rounded-md">
            {isLogin ? 'Log in' : 'Sign up'}
          </button>
        </div>
        <div className="flex justify-center items-center flex-col py-5">
          <p className="font-extrabold">
            {isLogin ? 'Don’t have an account?' : 'Already have an account?'}{' '}
            <Link
              to={isLogin ? '/register' : '/login'}
              className="text-[#2384F4] text-lg font-inter font-semibold underline"
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </Link>
          </p>
        </div>
      </div>
    </form>
  );
};

export default SignUpPage;
