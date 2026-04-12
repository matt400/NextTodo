export interface IChangePassword {
  Body: {
    current_password: string;
    new_password: string;
    confirm_password: string;
  };
}

export interface IUpdateData {
  Body: {
    username: string;
    email: string;
    isActive: boolean;
  };
}

export interface IRemoveUser {
  Body: {
    email: string;
  };
}

export interface IUserSettings {
  Body: {
    userSettings: {
      theme?: string;
      language?: string;
      view?: string;
      notificationType?: string;
      pomodoroTime?: number;
    };
  };
}

export type UserUpdateData = IUpdateData["Body"];
export type UserSettings = IUserSettings["Body"]["userSettings"];
