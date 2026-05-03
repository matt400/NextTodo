export const addTaskSchema = {
  body: {
    type: "object",
    required: ["task_name", "task_desc"],
    additionalProperties: false,
    properties: {
      task_name: { type: "string", minLength: 3, maxLength: 60 },
      task_desc: { type: "string", minLength: 0, maxLength: 2000 },
    },
  },
};

export const getTaskSchema = {
  querystring: {
    type: "object",
    additionalProperties: false,
    properties: {
      single: { type: "boolean" },
      task_id: { type: "number" },
    },
  },
};

export const modifyTaskSchema = {
  body: {
    type: "object",
    required: ["task_id", "data"],
    additionalProperties: false,
    properties: {
      task_id: { type: "number" },
      data: {
        type: "object",
        minProperties: 1,
        additionalProperties: false,
        properties: {
          taskName: { type: "string", minLength: 3, maxLength: 60 },
          taskDesc: { type: "string", minLength: 0, maxLength: 2000 },
          isFinished: { type: "boolean" },
          categoryId: { type: ["number", "null"] },
        },
      },
    },
  },
};

export const removeTaskSchema = {
  body: {
    type: "object",
    required: ["task_id"],
    additionalProperties: false,
    properties: {
      task_id: {
        type: "array",
        items: { type: "number" },
        minItems: 1,
      },
    },
  },
};

const taskIdBodySchema = {
  body: {
    type: "object",
    required: ["task_id"],
    additionalProperties: false,
    properties: {
      task_id: { type: "number" },
    },
  },
};

export const getPomoSchema = taskIdBodySchema;
export const pausePomoSchema = taskIdBodySchema;
export const resumePomoSchema = taskIdBodySchema;
export const endPomoSchema = taskIdBodySchema;

export const startPomoSchema = {
  body: {
    type: "object",
    required: ["task_id", "duration"],
    additionalProperties: false,
    properties: {
      task_id: { type: "number" },
      duration: { type: "number", minimum: 1 },
    },
  },
};

export const getPomoHistorySchema = {};

export const deletePomoRecordSchema = {
  body: {
    type: "object",
    required: ["pomo_id"],
    additionalProperties: false,
    properties: {
      pomo_id: { type: "string" },
    },
  },
};

export const reorderTasksSchema = {
  body: {
    type: "object",
    required: ["items"],
    additionalProperties: false,
    properties: {
      items: {
        type: "array",
        minItems: 1,
        items: {
          type: "object",
          required: ["task_id", "sort_order"],
          additionalProperties: false,
          properties: {
            task_id: { type: "number" },
            sort_order: { type: "number", minimum: 0 },
          },
        },
      },
    },
  },
};
