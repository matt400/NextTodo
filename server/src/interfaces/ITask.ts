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
