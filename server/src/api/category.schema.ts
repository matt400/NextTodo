const ALLOWED_COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#14b8a6",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#64748b",
  "#84cc16",
  "#06b6d4",
  "#f43f5e",
];

const ALLOWED_ICONS = [
  "Briefcase",
  "Home",
  "Book",
  "Heart",
  "Star",
  "ShoppingCart",
  "Dumbbell",
  "Code",
  "Music",
  "Camera",
  "Plane",
  "Car",
  "Coffee",
  "Gamepad2",
  "Palette",
  "Globe",
  "Leaf",
  "Zap",
  "Target",
  "Users",
];

export const getCategorySchema = {
  querystring: {
    type: "object",
    additionalProperties: false,
    properties: {
      single: { type: "boolean" },
      category_id: { type: "number" },
    },
  },
};

export const createCategorySchema = {
  body: {
    type: "object",
    required: ["name", "color", "icon"],
    additionalProperties: false,
    properties: {
      name: { type: "string", minLength: 1, maxLength: 40 },
      color: { type: "string", enum: ALLOWED_COLORS },
      icon: { type: "string", enum: ALLOWED_ICONS },
    },
  },
};

export const modifyCategorySchema = {
  body: {
    type: "object",
    required: ["category_id", "data"],
    additionalProperties: false,
    properties: {
      category_id: { type: "number" },
      data: {
        type: "object",
        minProperties: 1,
        additionalProperties: false,
        properties: {
          name: { type: "string", minLength: 1, maxLength: 40 },
          color: { type: "string", enum: ALLOWED_COLORS },
          icon: { type: "string", enum: ALLOWED_ICONS },
        },
      },
    },
  },
};

export const removeCategorySchema = {
  body: {
    type: "object",
    required: ["category_id"],
    additionalProperties: false,
    properties: {
      category_id: { type: "number" },
    },
  },
};

export const getCategoryTasksSchema = {
  querystring: {
    type: "object",
    required: ["category_id"],
    additionalProperties: false,
    properties: {
      category_id: { type: "number" },
      tag_id: { type: "number" },
    },
  },
};
