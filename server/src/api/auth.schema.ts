import { fastifyPasswordProperty } from "@server/utils/password";
import { fastifyEmailProperty } from "@server/utils/email";

export const loginSchema = {
  body: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: fastifyEmailProperty,
      password: { type: "string" },
    },
    additionalProperties: false,
  },
};

export const registerSchema = {
  body: {
    type: "object",
    required: ["username", "email", "password", "confirm_password"],
    properties: {
      username: { type: "string", minLength: 3, maxLength: 50 },
      email: fastifyEmailProperty,
      password: fastifyPasswordProperty,
      confirm_password: { type: "string", minLength: 8 },
    },
    additionalProperties: false,
  },
};
