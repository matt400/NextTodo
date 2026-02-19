import { fastifyPasswordProperty } from "@server/utils/password";

export const loginSchema = {
  body: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: { type: "string", format: "email" },
      password: { type: "string" },
    },
  },
};

export const registerSchema = {
  body: {
    type: "object",
    required: ["username", "email", "password", "confirm_password"],
    properties: {
      username: { type: "string", minLength: 3, maxLength: 50 },
      email: { type: "string", format: "email" },
      password: fastifyPasswordProperty,
      confirm_password: { type: "string", minLength: 8 },
    },
  },
};
