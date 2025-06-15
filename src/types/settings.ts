
export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sound: boolean;
}

export interface ProfileSettings {
  name: string;
  email: string;
  phone: string;
}

export interface SystemSettings {
  language: string;
  timezone: string;
  autoLogout: string;
}

export interface Settings {
  notifications: NotificationSettings;
  profile: ProfileSettings;
  system: SystemSettings;
}
