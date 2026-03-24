import { fastifyPasswordProperty } from "@server/utils/password";

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
      email: { type: "string", minLength: 4 },
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
      email: { type: "string", minLength: 4 },
    },
  },
};
