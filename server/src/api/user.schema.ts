export const changePasswordSchema = {
  body: {
    type: "object",
    required: ["current_password", "password", "confirm_password"],
    properties: {
      current_password: { type: "string" },
      password: { type: "string" },
      confirm_password: { type: "string" },
    },
  },
};
