import { RealtimeChannel, SupabaseClient } from "@supabase/supabase-js";
import supabase from "../lib/supabase";

export default class Chat {
  constructor(client: SupabaseClient) {
    this.client = client;
  }
  client: SupabaseClient;
  messages: any[] = [];
  chats: any[] = [];
  chatsWatcher: RealtimeChannel;
  messagesWatchers: RealtimeChannel[] = [];
  messagecallbacks: Function[] = [];
  chatscallbacks: Function[] = [];

  addMessagesWatcher(chat_id) {
    const Watcher = this.client
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `chat_id=eq.${chat_id}`,
        },
        (payload) => {
          this.messages.push(payload.new);
        }
      )
      .subscribe();

    this.messagesWatchers.push(Watcher);
  }

  addMessage(message) {
    this.messages.push(message);
    this.messagecallbacks.forEach((func) => func(message));
  }
  async addChat(chat) {
    this.chats.push(chat);
    const { data, error } = await this.client
      .from("messages")
      .select()
      .eq("chat_id", chat.id);
    data && data.forEach((message) => this.addMessage(message));
    this.addMessagesWatcher(chat.id);
    this.chatscallbacks.forEach((func) => func(chat));
  }

  async connect(user_id) {
    const { data, error } = await this.client
      .from("chats")
      .select()
      .contains("users", [user_id]);
    data && data.forEach((chat) => this.addChat(chat));

    const chatsWatcher = this.client
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chats",
          filter: `users=cs.{${user_id}}`,
        },
        (payload) => {
          this.addChat(payload.new);
        }
      )
      .subscribe();

    this.chatsWatcher = chatsWatcher;
  }

  async disConnect() {
    this.chatsWatcher.unsubscribe();
    this.messagesWatchers.forEach((channel) => channel.unsubscribe());
    this.chats = [];
    this.messages = [];
  }

  onNewMessages(callback) {
    const index = this.messagecallbacks.push(callback);
    return () => delete this.messagecallbacks[index];
  }

  onNewChat(callback) {
    const index = this.messagecallbacks.push(callback);
    return () => delete this.chatscallbacks[index];
  }
}
const chatService = new Chat(supabase);

function onSignin(user_id) {
  chatService.connect(user_id);
  chatService.onNewChat((chat) => console.log("new chat :>> ", chat));
  chatService.onNewMessages((message) =>
    console.log("new message :>> ", message)
  );
}

function onSignout() {
  chatService.disConnect();
  console.log(" SIGNED_OUT :>> ");
}
