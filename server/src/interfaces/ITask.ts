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

export interface ITaskRemoveRequest {
  Body: {
    task_id: number[];
  };
}

export interface IStartPomoRequest {
  Body: {
    task_id: number;
    duration: number;
  };
}

export interface IPausePomoRequest {
  Body: {
    task_id: number;
    elapsed: number;
  };
}

export interface IResumePomoRequest {
  Body: {
    task_id: number;
  };
}

export type IEndPomoRequest = IResumePomoRequest;
