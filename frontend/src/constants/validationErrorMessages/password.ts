import { passwordValidationRules } from '../validationRules/password';

export const passwordValidationErrorMessages = Object.freeze({
  maxLength: `Password must be no longer than ${passwordValidationRules.maxLength} characters`,
  minLength: 'Password is required',
});
