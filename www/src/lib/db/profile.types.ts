interface Notifications {
  messages: boolean;
  bookings: boolean;
  ads: boolean;
}
export interface Userinfo {
  avatar_url: string;
  id: string;
  full_name: string;
}

export interface User {
  updated_at: string;
  avatar_url: string;
  full_name: string;
  id: string;
  website?: string;
  contact?: object;
  cover_url?: string;
  fcm_token?: string;
  notifications?: Notifications;
  email: string;
  user_metadata: any;
}
