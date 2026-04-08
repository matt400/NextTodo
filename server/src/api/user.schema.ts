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

export const userSettingsSchema = {
  body: {
    type: "object",
    required: ["userSettings"],
    properties: {
      userSettings: {
        type: "object",
        properties: {
          theme: { type: "string", enum: ["light", "dark", "system"] },
          language: { type: "string", enum: ["pl", "en"] },
          view: { type: "string", enum: ["window", "full"] },
          notificationType: { type: "string", enum: ["toast", "inline"] },
          pomodoroTime: { type: "number", minimum: 0, maximum: 60 },
        },
        minProperties: 1,
        additionalProperties: false,
      },
    },
  },
};
