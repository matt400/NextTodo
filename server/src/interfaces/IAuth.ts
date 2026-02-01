export interface ILoginRequest {
  Body: {
    email: string;
    password: string;
  };
  user: {
    email: string;
  };
}

export interface IRegisterRequest {
  Body: {
    username: string;
    email: string;
    password: string;
    confirm_password: string;
  };
  Cookies: {
    access_token?: string;
  };
}

export type RegisterRequestBody = IRegisterRequest["Body"];
