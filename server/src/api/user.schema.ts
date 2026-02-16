import { fastifyPasswordProperty } from "@server/utils/password";

export const changePasswordSchema = {
  body: {
    type: "object",
    required: ["current_password", "new_password", "confirm_password"],
    properties: {
      current_password: { type: "string", minLength: 1 },
      new_password: fastifyPasswordProperty,
      confirm_password: { type: "string", minLength: 8 },
    },
  },
};
