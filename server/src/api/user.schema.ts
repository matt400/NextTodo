import { fastifyPasswordProperty } from "@server/utils/password";
import { fastifyEmailProperty } from "@server/utils/email";

export const changePasswordSchema = {
  body: {
    type: "object",
    required: ["current_password", "new_password", "confirm_password"],
    properties: {
      current_password: { type: "string", minLength: 1 },
      new_password: fastifyPasswordProperty,
      confirm_password: fastifyPasswordProperty,
    },
  },
};

export const updateDataSchema = {
  body: {
    type: "object",
    properties: {
      username: { type: "string", minLength: 3 },
      email: fastifyEmailProperty,
      isActive: { type: "boolean" },
    },
    minProperties: 1,
  },
};

export const removeUserSchema = {
  body: {
    type: "object",
    required: ["email"],
    properties: {
      email: fastifyEmailProperty,
    },
  },
};
