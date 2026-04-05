/**
 * Property for Fastify
 */
export const fastifyPasswordProperty = {
  type: "string",
  minLength: 8,
  maxLength: 100,
  pattern:
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$",
};

/**
 * Checks if password meets requirements
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  errorKey?: string;
} {
  if (password.length < 8) {
    return { isValid: false, errorKey: "PASSWORD_TOO_SHORT" };
  }

  if (password.length > 100) {
    return { isValid: false, errorKey: "PASSWORD_TOO_LONG" };
  }

  if (!/[A-Z]/.test(password)) {
    return { isValid: false, errorKey: "PASSWORD_REQUIRES_UPPERCASE" };
  }

  if (!/[a-z]/.test(password)) {
    return { isValid: false, errorKey: "PASSWORD_REQUIRES_LOWERCASE" };
  }

  if (!/[0-9]/.test(password)) {
    return { isValid: false, errorKey: "PASSWORD_REQUIRES_NUMBER" };
  }

  if (!/[@$!%*?&]/.test(password)) {
    return { isValid: false, errorKey: "PASSWORD_REQUIRES_SPECIAL_CHAR" };
  }

  return { isValid: true };
}

/**
 * Checks if passwords does not match
 */
export function validatePasswordsMatch(
  password: string,
  confirmPassword: string,
): { isValid: boolean; errorKey?: string } {
  if (password !== confirmPassword) {
    return { isValid: false, errorKey: "PASSWORDS_DO_NOT_MATCH" };
  }
  return { isValid: true };
}

/**
 * Checks if new password is different than old password
 */
export function validatePasswordsDifferent(
  oldPassword: string,
  newPassword: string,
): { isValid: boolean; errorKey?: string } {
  if (oldPassword === newPassword) {
    return { isValid: false, errorKey: "NEW_PASSWORD_MUST_BE_DIFFERENT" };
  }
  return { isValid: true };
}
