const emailPattern = /^[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}$/;

/**
 * Property for Fastify
 */
export const fastifyEmailProperty = {
  type: "string",
  minLength: 5,
  maxLength: 254,
  pattern: emailPattern.toString(),
};

/**
 * Checks if email meets requirements
 */
export function validateEmail(email: string): {
  isValid: boolean;
  errorKey?: string;
} {
  if (email.length < 5) {
    return { isValid: false, errorKey: "EMAIL_TOO_SHORT" };
  }
  if (email.length > 254) {
    return { isValid: false, errorKey: "EMAIL_TOO_LONG" };
  }
  if (!emailPattern.test(email)) {
    return { isValid: false, errorKey: "EMAIL_INVALID_FORMAT" };
  }
  return { isValid: true };
}
