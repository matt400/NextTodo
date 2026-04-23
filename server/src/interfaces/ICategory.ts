export interface ICategoryGetRequest {
  Querystring: {
    single?: boolean;
    category_id?: number;
  };
}

export interface ICategoryGetTasksRequest {
  Querystring: {
    category_id: number;
  };
}

export interface ICategoryCreateRequest {
  Body: {
    name: string;
    color: string;
    icon: string;
  };
}

export interface ICategoryModifyRequest {
  Body: {
    category_id: number;
    data: Partial<{
      name: string;
      color: string;
      icon: string;
    }>;
  };
}

export interface ICategoryRemoveRequest {
  Body: {
    category_id: number;
  };
}
