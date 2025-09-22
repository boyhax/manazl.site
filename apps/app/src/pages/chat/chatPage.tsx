import {
  IonButton, IonContent,
  IonFooter,
  IonIcon, IonProgressBar, IonTitle
} from "@ionic/react";

import { useEffect, useRef, useState } from "react";
import Page, { Header, HeaderBackButton } from "src/components/Page";

import { useTranslate } from "@tolgee/react";

import { sendSharp } from "ionicons/icons";
import { useInView } from "react-intersection-observer";
import { useParams } from "react-router";
import useAuth from "src/hooks/useAuth";
import {
  Chat, Message,
  sendMessage,
  watchMessages
} from "src/lib/db/chat";
import supabase from "src/lib/supabase";
import { create } from "zustand";
import { timeAgo } from "src/lib/utils/timeAgo";
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";

import { cn } from "src/lib/utils";

interface Props {
  messages: Message[];
  chat: Chat & { user: { full_name, avatar_url } };
  onRecived: (message: any) => void;
}
const usechat = create<Props>((set, get) => ({
  messages: [],
  chat: null,
  onRecived: (message) => set({ messages: [...get().messages, message] }),
}));
const ChatPage = (): JSX.Element => {
  const content = useRef<HTMLIonContentElement>();
  const { t } = useTranslate();

  const [newMessage, setNewMessage] = useState("");

  const { chat, messages } = usechat();
  const [loading, setloading] = useState(true);
  const [sending, setsending] = useState(false);
  const id = useParams().id;

  const {
    session: {
      user,
    },
  } = useAuth();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const onSend = async (text: string) => {
    setsending(true);
    const { data, error } = await sendMessage({ text }, id);

    if (data) {
      console.trace(data);
    }
    if (error) {
      console.trace("error from onSend :>> ", error);
    }
    setsending(false);
  };

  function scrollToBottom() {

    content.current?.scrollToBottom(1000);
  }
  const hundlesend = async () => {
    await onSend(newMessage);
    setNewMessage("");
    scrollToBottom();
  };
  const getAllmessages = async () => {
    setloading(true);
    let { data: chat, error } = await supabase.from('chats').select('*,listing:listings(full_name:title,avatar_url:thumbnail),user:profiles(avatar_url,full_name),messages(*)')
      .eq('id', id).limit(30, { referencedTable: 'messages' })
      .order('created_at', { ascending: false, referencedTable: 'messages' })
      .single()

    if (error) throw Error(error.message)
    setloading(false);

    if (chat.user_id == user.id) {
      chat.user = chat.listing
    }
    usechat.setState({ chat, messages: chat.messages });
    console.log("chat, error :>> ", chat, error);
  };
  useEffect(() => {
    usechat.setState({ chat: null, messages: [] });
    getAllmessages();

    const chatsWatcher = watchMessages(id, (message) => {
      usechat.getState().onRecived(message);
    });

    return () => {
      chatsWatcher.unsubscribe();
      setloading(false);
    };
  }, []);

  if (loading) {
    return <IonProgressBar type={"indeterminate"} />;
  }

  return (
    <Page>
      <Header>

        <HeaderBackButton />

        {chat?.user ? <>
          <Avatar className="w-8 h-8 mr-2 flex-shrink-0">
            <AvatarImage
              src={chat.user?.avatar_url}
              alt={chat.user?.full_name}
            />
            <AvatarFallback>{chat.user.full_name ? chat.user.full_name[0] : 'AB'}</AvatarFallback>
          </Avatar>
          <IonTitle>{t(chat?.user?.full_name)}</IonTitle></> : null}

      </Header>

      <IonContent ref={content}>
        <div dir="ltr" className="flex flex-col overflow-y-auto space-y-3 max-w-md mx-auto pb-16">
          {messages?.map(
            ({ user_id, text, created_at, id, is_read }, index: number) => {
              const sender = user.id === user_id;
              return (
                <div
                  dir={sender ? "rtl" : "ltr"}
                  className={
                    "  mt-5 mx-4  bg-transparent animate-fade-left animate-once"
                  }
                  key={index}
                >
                  {!sender && !is_read && <MessageView id={id} />}
                  <div
                    className={cn(
                      "flex flex-row w-full max-w-xs",
                      sender ? "float-right " : " float-left"
                    )}
                  >
                    {!sender && (
                      <Avatar className="w-8 h-8 mr-2 flex-shrink-0">
                        <AvatarImage
                          src={chat.user.avatar_url}
                          alt={chat.user.full_name}
                        />
                        <AvatarFallback>{chat.user.full_name[0]}</AvatarFallback>
                      </Avatar>
                    )}
                    <div className="flex flex-col max-w-[calc(100%-2rem)]">
                      <div
                        className={cn(
                          "p-3 rounded-2xl break-words",
                          sender
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-black"
                        )}
                      >
                        <p className="text-sm">{text}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 self-start">
                        {timeAgo(new Date(created_at))}
                      </p>
                    </div>
                  </div>

                </div>
              );
            }
          )}
        </div>
      </IonContent>

      <IonFooter
        slot={"bottom"}
        className={" max-w-md mx-auto fixed bottom-0 left-0 right-0"}
      >
        <form
          className={
            " p-1  flex  ps-5 dark:border-t-slate-200   bg-background   rounded-xl  flex-row justify-between "
          }
          dir="ltr"
          onSubmit={(e) => {
            e.preventDefault();
            hundlesend();
          }}
        >
          <textarea
            inputMode="text"
            disabled={sending}
            placeholder={t("Write ...")}
            className={"outline-none w-full bg-inherit"}
            value={sending ? t("Sending ...") : newMessage}
            onInput={(e) => setNewMessage(e.currentTarget.value!)}
          ></textarea>

          <IonButton fill={"clear"} disabled={!newMessage} type="submit">
            <IonIcon icon={sendSharp} />
          </IonButton>
        </form>
      </IonFooter>
    </Page>
  );
};

export default ChatPage;

const MessageView = ({ id }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    see(id);
  }, [inView]);
  return <div ref={ref}></div>;
};
const see = async (id) => {
  const { error } = await supabase
    .from("messages")
    .update({ is_read: true })
    .eq("id", id);
  if (!error) {
    console.trace("message seen ", id);
  }
};
