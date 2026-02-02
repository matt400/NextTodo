export interface IUser {
  Body: {
    current_password: string;
    password: string;
    new_password: string;
  };
}
