export interface ITaskGetRequest {
  Querystring: {
    single: boolean;
    task_id: number;
  };
}

export interface ITaskAddRequest {
  Body: {
    task_name: string;
    task_desc: string;
  };
}

export interface ITaskModifyRequest {
  Body: {
    task_id: number;
    data: object;
  };
}
