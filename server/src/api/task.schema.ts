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

export const modfiyTaskSchema = {
  body: {
    type: "object",
    required: ["task_id", "data"],
    properties: {
      task_id: { type: "number" },
      data: {
        type: "object",
        minProperties: 1,
        properties: {
          taskName: { type: "string" },
          taskDesc: { type: "string" },
          isFinished: { type: "boolean" },
        },
      },
    },
  },
};

export const removeTaskSchema = {
  body: {
    type: "object",
    required: ["task_id"],
    properties: {
      task_id: {
        type: "array",
        items: { type: "number" },
        minItems: 1,
      },
    },
  },
};

export const startPomoSchema = {
  body: {
    type: "object",
    required: ["task_id", "duration"],
    properties: {
      task_id: { type: "number" },
      duration: { type: "number" },
    },
  },
};

export const pausePomoSchema = {
  body: {
    type: "object",
    required: ["task_id", "elapsed"],
    properties: {
      task_id: { type: "number" },
      elapsed: { type: "number" },
    },
  },
};

export const resumePomoSchema = {
  body: {
    type: "object",
    required: ["task_id"],
    properties: {
      task_id: { type: "number" },
    },
  },
};

export const endPomoSchema = {
  body: {
    type: "object",
    required: ["task_id"],
    properties: {
      task_id: { type: "number" },
    },
  },
};
