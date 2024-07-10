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
import { toastMessages } from '../../constants/toast';
import { HttpError } from '../../util/HttpError';
import { Button, Link, TextField } from '@mui/material';
import { userValidator } from '../../validators/user';
import { useDebounce } from '../../util/useDebounce';
import { useToast } from '../../util/useToast';
import { Trans, useTranslation } from 'react-i18next';
import { usernameValidationRules } from '../../constants/validationRules/username';
import { emailValidationRules } from '../../constants/validationRules/email';
import { passwordValidationRules } from '../../constants/validationRules/password';

type AuthFormProps = {
  isLogin: boolean;
};

const SignUpPage: React.FC<AuthFormProps> = ({ isLogin }) => {
  const { setUser } = useCurrentUser();
  const toast = useToast();
  const { t: validationT } = useTranslation('validationErrorMessages');
  const { t } = useTranslation('auth');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const [usernameFieldWasChanged, setUsernameFieldWasChanged] = useState(false);
  const [passwordFieldWasChanged, setPasswordFieldWasChanged] = useState(false);
  const [emailFieldWasChanged, setEmailFieldWasChanged] = useState(false);

  const debouncedUsernameStatusChange = useDebounce(() => setUsernameFieldWasChanged(true));
  const debouncedPasswordStatusChange = useDebounce(() => setPasswordFieldWasChanged(true));
  const debouncedEmailStatusChange = useDebounce(() => setEmailFieldWasChanged(true));

  const [usernameErrors, setUsernameErrors] = useState<string[]>([]);
  const passwordErrors = userValidator.validatePassword(password);
  const [emailErrors, setEmailErrors] = useState<string[]>([]);

  const navigate = useNavigate();

  const usernameIsValid = usernameErrors.length === 0 && usernameFieldWasChanged;
  const passwordIsValid = passwordErrors.length === 0 && passwordFieldWasChanged;
  const emailIsValid = (emailErrors.length === 0 && emailFieldWasChanged) || isLogin;

  const submitButtonIsDisabled = !usernameIsValid || !passwordIsValid || !emailIsValid;

  function handleUsernameChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    const value = event.target.value;
    setUsername(value);
    setUsernameErrors(userValidator.validateUsername(value));

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

    setEmailErrors(userValidator.validateEmail(value));

    debouncedEmailStatusChange();
  }

  async function authenticaticateUser(id: number, tokens: SuccessfulAuthenticationResponse) {
    localStorage.setItem('accessToken', tokens.access);
    localStorage.setItem('refreshToken', tokens.refresh);
    const data = await userService.getUserById(id);
    setUser({ user_id: id, ...data });
    navigate('/');
    toast.success({ toastKey: isLogin ? toastMessages.login : toastMessages.register });
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
      if (error instanceof HttpError) {
        if (isLogin && error.err.status === 401) {
          toast.error({
            error,
            toastKey: toastMessages.failedLogin,
          });
        } else {
          if (isLogin) {
            toast.error({
              error,
              excludedStatusCodes: [400],
            });
          } else {
            const errors = await error.err.json();
            if (errors.username && Array.isArray(errors.username)) {
              setUsernameErrors(errors.username.map((u: string) => `username.${u}`));
            }

            if (errors.email && Array.isArray(errors.email)) {
              setEmailErrors(errors.email.map((e: string) => `email.${e}`));
            }

            // in case server is down or some other unexpected error pops up
            toast.error({
              error,
              excludedStatusCodes: [400],
            });
          }
        }
      }
    }
  }

  return (
    <form onSubmit={handleSubmitAuthForm}>
      <div className="flex justify-center items-center flex-col">
        <h2 className="text-4xl text-center font-bold pt-20 pb-10 text-secondary">
          {t(isLogin ? 'login.title' : 'register.title')}
        </h2>
        <div className="w-full flex justify-center mb-8 lg:mb-4">
          <TextField
            className="w-3/4 lg:w-96"
            placeholder={t('common.usernameField.placeholder')}
            size="small"
            label={
              !usernameIsValid && usernameFieldWasChanged
                ? validationT(usernameErrors[0], { usernameValidationRules })
                : t('common.usernameField.label')
            }
            id="username"
            error={!usernameIsValid && usernameFieldWasChanged}
            onChange={handleUsernameChange}
          />
        </div>
        {!isLogin ? (
          <div className="w-full flex justify-center mb-8 lg:mb-4">
            <TextField
              size="small"
              label={
                !emailIsValid && emailFieldWasChanged
                  ? validationT(emailErrors[0], { emailValidationRules })
                  : t('common.emailField.label')
              }
              className="w-3/4 lg:w-96"
              placeholder={t('common.emailField.placeholder')}
              id="email-address"
              error={!emailIsValid && emailFieldWasChanged}
              onChange={handleEmailChange}
            />
          </div>
        ) : null}
        <TextField
          size="small"
          label={
            !passwordIsValid && passwordFieldWasChanged
              ? validationT(passwordErrors[0], { passwordValidationRules })
              : t('common.passwordField.label')
          }
          className="w-3/4 lg:w-96"
          placeholder={t('common.passwordField.placeholder')}
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
            {t(isLogin ? 'login.signInButtonText' : 'register.signUpButtonText')}
          </Button>
        </div>
        <div className="flex justify-center items-center flex-col py-5">
          <p className="font-extrabold text-center">
            <Trans
              i18nKey={isLogin ? 'login.linkToRegister' : 'register.linkToLogin'}
              t={t}
              components={{
                linkToLogin: <Link href="/login" color="#2384F4" underline="hover" />,
                linkToRegister: <Link href="/register" color="#2384F4" underline="hover" />,
              }}
            ></Trans>
          </p>
        </div>
      </div>
    </form>
  );
};

export default SignUpPage;
