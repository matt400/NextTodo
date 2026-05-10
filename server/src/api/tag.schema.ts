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

export const getTagSchema = {
  querystring: {
    type: "object",
    additionalProperties: false,
    properties: {
      single: { type: "boolean" },
      tag_id: { type: "number" },
    },
  },
};

export const createTagSchema = {
  body: {
    type: "object",
    required: ["name", "color"],
    additionalProperties: false,
    properties: {
      name: { type: "string", minLength: 1, maxLength: 30 },
      color: { type: "string", enum: ALLOWED_COLORS },
    },
  },
};

export const modifyTagSchema = {
  body: {
    type: "object",
    required: ["tag_id", "data"],
    additionalProperties: false,
    properties: {
      tag_id: { type: "number" },
      data: {
        type: "object",
        minProperties: 1,
        additionalProperties: false,
        properties: {
          name: { type: "string", minLength: 1, maxLength: 30 },
          color: { type: "string", enum: ALLOWED_COLORS },
        },
      },
    },
  },
};

export const removeTagSchema = {
  body: {
    type: "object",
    required: ["tag_id"],
    additionalProperties: false,
    properties: {
      tag_id: { type: "number" },
    },
  },
};

// GET /tags/tasks?tag_ids=1&tag_ids=2 — filter tasks by one or more tags (OR logic)
export const getTasksByTagsSchema = {
  querystring: {
    type: "object",
    required: ["tag_ids"],
    additionalProperties: false,
    properties: {
      tag_ids: {
        type: "array",
        items: { type: "number" },
        minItems: 1,
      },
    },
  },
};

// POST /tags/tasks — connect a tag to a task
export const addTagToTaskSchema = {
  body: {
    type: "object",
    required: ["task_id", "tag_id"],
    additionalProperties: false,
    properties: {
      task_id: { type: "number" },
      tag_id: { type: "number" },
    },
  },
};

// DELETE /tags/tasks — disconnect a tag from a task
export const removeTagFromTaskSchema = {
  body: {
    type: "object",
    required: ["task_id", "tag_id"],
    additionalProperties: false,
    properties: {
      task_id: { type: "number" },
      tag_id: { type: "number" },
    },
  },
};
