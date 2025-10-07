// Field validation messages
export const FIELD_REQUIRED_MESSAGE = 'This field is required.'

// Email validation
export const EMAIL_RULE = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
export const EMAIL_RULE_MESSAGE =
  'Please enter a valid email address (e.g., admin@library.com)'

// Password validation
export const PASSWORD_RULE = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/
export const PASSWORD_RULE_MESSAGE =
  'Password must be at least 8 characters and contain at least one letter and one number'

// Login specific validation
export const LOGIN_EMAIL_REQUIRED = 'Email is required to login'
export const LOGIN_PASSWORD_REQUIRED = 'Password is required to login'
export const LOGIN_EMAIL_INVALID = 'Please enter a valid admin email address'
export const LOGIN_PASSWORD_INVALID =
  'Password must be at least 8 characters with letters and numbers'

// Validation helper functions
export const validateEmail = (email: string): boolean => {
  return EMAIL_RULE.test(email)
}

export const validatePassword = (password: string): boolean => {
  return PASSWORD_RULE.test(password)
}

export const getEmailError = (
  email: string | undefined
): string | undefined => {
  if (!email || email.trim() === '') return LOGIN_EMAIL_REQUIRED
  if (!validateEmail(email)) return LOGIN_EMAIL_INVALID
  return undefined
}

export const getPasswordError = (
  password: string | undefined
): string | undefined => {
  if (!password || password.trim() === '') return LOGIN_PASSWORD_REQUIRED
  if (!validatePassword(password)) return LOGIN_PASSWORD_INVALID
  return undefined
}
