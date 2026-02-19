export const addTaskSchema = {
  body: {
    type: "object",
    required: ["task_name", "task_desc"],
    properties: {
      task_name: { type: "string", minLength: 3, maxLength: 60 },
      task_desc: { type: "string", minLength: 0, maxLength: 2000 },
    },
  },
};

export const getTaskSchema = {
  querystring: {
    type: "object",
    properties: {
      single: { type: "boolean" },
      task_id: { type: "number" },
    },
  },
};
