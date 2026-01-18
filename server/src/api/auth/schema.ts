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
      username: { type: "string", minLength: 3 },
      email: { type: "string", format: "email" },
      password: { type: "string", minLength: 8 },
      confirm_password: { type: "string", minLength: 8 },
    },
  },
};
