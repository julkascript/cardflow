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
import { Button, Link, TextField, Typography } from '@mui/material';
import { userValidator } from '../../validators/user';
import { useDebounce } from '../../util/useDebounce';

type AuthFormProps = {
  isLogin: boolean;
};

const SignUpPage: React.FC<AuthFormProps> = ({ isLogin }) => {
  const { setUser } = useCurrentUser();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const [usernameFieldWasChanged, setUsernameFieldWasChanged] = useState(false);
  const [passwordFieldWasChanged, setPasswordFieldWasChanged] = useState(false);
  const [emailFieldWasChanged, setEmailFieldWasChanged] = useState(false);

  const debouncedUsernameStatusChange = useDebounce(() => setUsernameFieldWasChanged(true));
  const debouncedPasswordStatusChange = useDebounce(() => setPasswordFieldWasChanged(true));
  const debouncedEmailStatusChange = useDebounce(() => setEmailFieldWasChanged(true));

  const usernameErrors = userValidator.validateUsername(username);
  const passwordErrors = userValidator.validatePassword(password);
  const emailErrors = userValidator.validateEmail(email);

  const navigate = useNavigate();

  const usernameIsValid = usernameErrors.length === 0 && usernameFieldWasChanged;
  const passwordIsValid = passwordErrors.length === 0 && passwordFieldWasChanged;
  const emailIsValid = (emailErrors.length === 0 && emailFieldWasChanged) || isLogin;

  const submitButtonIsDisabled = !usernameIsValid || !passwordIsValid || !emailIsValid;

  const [otherErrors, setOtherErrors] = useState<string[]>([]);

  function handleUsernameChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    const value = event.target.value;
    setUsername(value);

    debouncedUsernameStatusChange();
  }

  function handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    const value = event.target.value;
    setPassword(value);

    debouncedPasswordStatusChange();
  }

  function handleEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    const value = event.target.value;
    setEmail(value);

    debouncedEmailStatusChange();
  }

  async function authenticaticateUser(id: number, tokens: SuccessfulAuthenticationResponse) {
    localStorage.setItem('accessToken', tokens.access);
    localStorage.setItem('refreshToken', tokens.refresh);
    const data = await userService.getUserById(id);
    setUser({ user_id: id, ...data });
    navigate('/');
    toast.success(isLogin ? toastMessages.success.login : toastMessages.success.register);
  }

  async function handleSubmitAuthForm(event: React.FormEvent) {
    event.preventDefault();
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
      // const data = await error.err.json();
      // setError(data);
      if (error instanceof HttpError) {
        if (isLogin && error.err.status === 401) {
          errorToast(error, toastMessages.error.failedLogin);
        } else {
          if (isLogin) {
            errorToast(error, undefined, 400);
          } else {
            const errors = await error.err.json();
            if (errors.username && Array.isArray(errors.username)) {
              setOtherErrors(errors.username);
            }
          }
        }
      }
    }
  }

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
            label={!usernameIsValid && usernameFieldWasChanged ? usernameErrors[0] : 'Username'}
            id="username"
            error={!usernameIsValid && usernameFieldWasChanged}
            onChange={handleUsernameChange}
          />
        </div>
        {!isLogin ? (
          <div className="w-full flex justify-center mb-8 lg:mb-4">
            <TextField
              size="small"
              label={!emailIsValid && emailFieldWasChanged ? emailErrors[0] : 'Email Address'}
              className="w-3/4 lg:w-96"
              placeholder="Email Address"
              id="email-address"
              error={!emailIsValid && emailFieldWasChanged}
              onChange={handleEmailChange}
            />
          </div>
        ) : null}
        <TextField
          size="small"
          label={!passwordIsValid && passwordFieldWasChanged ? passwordErrors[0] : 'Password'}
          className="w-3/4 lg:w-96"
          placeholder="Password"
          type="password"
          error={!passwordIsValid && passwordFieldWasChanged}
          onChange={handlePasswordChange}
        />
        <div className="flex items-center flex-col mt-4">
          <Button
            disabled={submitButtonIsDisabled}
            type="submit"
            color="primary"
            variant="contained"
            size="large"
          >
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
        {otherErrors.map((e) => (
          <Typography color="error" key={e}>
            {e}
          </Typography>
        ))}
      </div>
    </form>
  );
};

export default SignUpPage;
