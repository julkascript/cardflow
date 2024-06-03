import { emailValidationErrorMessages } from '../constants/validationErrorMessages/email';
import { passwordValidationErrorMessages } from '../constants/validationErrorMessages/password';
import { usernameValidationErrorMessages } from '../constants/validationErrorMessages/username';
import { emailValidationRules } from '../constants/validationRules/email';
import { passwordValidationRules } from '../constants/validationRules/password';
import { usernameValidationRules } from '../constants/validationRules/username';

type userErrorMessage = string;

export const userValidator = {
  validateUsername(username: string): userErrorMessage[] {
    username = username.trim();
    const errorMessages: userErrorMessage[] = [];

    const minLengthIsValid = username.length >= usernameValidationRules.minLength;
    const maxLengthIsValid = username.length <= usernameValidationRules.maxLength;
    const patternIsValid = usernameValidationRules.pattern.test(username);

    if (!minLengthIsValid) {
      errorMessages.push(usernameValidationErrorMessages.minLength);
    }

    if (!maxLengthIsValid) {
      errorMessages.push(usernameValidationErrorMessages.maxLength);
    }

    if (!patternIsValid) {
      errorMessages.push(usernameValidationErrorMessages.pattern);
    }

    return errorMessages;
  },

  validatePassword(password: string): userErrorMessage[] {
    password = password.trim();
    const errorMessages: userErrorMessage[] = [];

    const minLengthIsValid = password.length >= passwordValidationRules.minLength;
    const maxLengthIsValid = password.length <= passwordValidationRules.maxLength;

    if (!minLengthIsValid) {
      errorMessages.push(passwordValidationErrorMessages.minLength);
    }

    if (!maxLengthIsValid) {
      errorMessages.push(passwordValidationErrorMessages.maxLength);
    }

    return errorMessages;
  },

  validateEmail(email: string): userErrorMessage[] {
    email = email.trim();
    const errorMessages: userErrorMessage[] = [];

    const minLengthIsValid = email.length >= emailValidationRules.minLength;
    const maxLengthIsValid = email.length <= emailValidationRules.maxLength;
    const patternIsValid = emailValidationRules.pattern.test(email);

    if (!minLengthIsValid) {
      errorMessages.push(emailValidationErrorMessages.minLength);
    }

    if (!maxLengthIsValid) {
      errorMessages.push(emailValidationErrorMessages.maxLength);
    }

    if (!patternIsValid) {
      errorMessages.push(emailValidationErrorMessages.pattern);
    }

    return errorMessages;
  },
};
