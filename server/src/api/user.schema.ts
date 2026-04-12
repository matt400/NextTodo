import { fastifyPasswordProperty } from "@server/utils/password";
import { fastifyEmailProperty } from "@server/utils/email";

export const changePasswordSchema = {
  body: {
    type: "object",
    required: ["current_password", "new_password", "confirm_password"],
    additionalProperties: false,
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
    minProperties: 1,
    additionalProperties: false,
    properties: {
      username: { type: "string", minLength: 3, maxLength: 50 },
      email: fastifyEmailProperty,
      isActive: { type: "boolean" },
    },
  },
};

export const removeUserSchema = {
  body: {
    type: "object",
    required: ["email"],
    additionalProperties: false,
    properties: {
      email: fastifyEmailProperty,
    },
  },
};

export const userSettingsSchema = {
  body: {
    type: "object",
    required: ["userSettings"],
    additionalProperties: false,
    properties: {
      userSettings: {
        type: "object",
        minProperties: 1,
        additionalProperties: false,
        properties: {
          theme: { type: "string", enum: ["light", "dark", "system"] },
          language: { type: "string", enum: ["pl", "en"] },
          view: { type: "string", enum: ["window", "full"] },
          notificationType: { type: "string", enum: ["toast", "inline"] },
          pomodoroTime: { type: "number", minimum: 0, maximum: 60 },
        },
      },
    },
  },
};
