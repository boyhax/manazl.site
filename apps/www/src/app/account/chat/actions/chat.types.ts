export interface Message {
  text: string;
  created_at: string;
  id: string;
  url?: string;
  user_id: string;
  chat_id: string;
  to_user_id?: string;
  is_read: boolean;
}
interface Chat_user {
  id;
  user: { full_name; avatar_url };
}
export interface Chat {
  user: { avatar_url; full_name; id };
  message: Message;
  chat_users: Chat_user[];
  id: string;
  unseen: number;
  created_at: string | Date;
  messages?: Message[];
}

export interface NewMessage {
  text: string;
  url?: string;
}
