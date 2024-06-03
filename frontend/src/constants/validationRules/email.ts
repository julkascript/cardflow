export const emailValidationRules = Object.freeze({
  maxLength: 254,
  minLength: 1,
  pattern: /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,6}$/i,
});
