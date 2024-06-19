import { passwordValidationRules } from '../validationRules/password';

export const passwordValidationErrorMessages = Object.freeze({
  maxLength: 'password.maxLength',
  minLength: 'password.minLength',
});

/**
 * @deprecated
 */
export const legacyPasswordValidationErrorMessages = Object.freeze({
  maxLength: `Password must be no longer than ${passwordValidationRules.maxLength} characters`,
  minLength: 'Password is required',
});
