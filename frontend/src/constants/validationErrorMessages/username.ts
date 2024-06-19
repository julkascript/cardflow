import { usernameValidationRules } from '../validationRules/username';

export const usernameValidationErrorMessages = Object.freeze({
  maxLength: 'username.maxLength',
  minLength: 'username.minLength',
  pattern: 'username.pattern',
});

/**
 * @deprecated
 */
export const legacyUsernameValidationErrorMessages = Object.freeze({
  maxLength: `Username must be no longer than ${usernameValidationRules.maxLength} characters`,
  minLength: 'Username is required',
  pattern: 'The username contains an invalid character',
});
