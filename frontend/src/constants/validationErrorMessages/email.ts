import { emailValidationRules } from '../validationRules/email';

export const emailValidationErrorMessages = Object.freeze({
  minLength: 'email.minLength',
  maxLength: 'email.maxLength',
  pattern: 'email.pattern',
});

/**
 * @deprecated
 */
export const legacyEmailValidationErrorMessages = Object.freeze({
  minLength: 'Email is required',
  maxLength: `Email must be no longer than ${emailValidationRules.maxLength} characters`,
  pattern: 'Invalid email',
});
