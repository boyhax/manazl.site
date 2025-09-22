import {
  IonSpinner,
  useIonToast
} from "@ionic/react";
import { useTranslate } from "@tolgee/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useSupabaseQuery from "src/hooks/useSupabaseQuery";
import { getuserid } from "src/lib/db/auth";
import supabase from "src/lib/supabase";
import { timeAgo } from "src/lib/utils/timeAgo";
import Avatar from "./Avatar";
import { auth } from "src/state/auth";
import { EmptyMessage, ErrorMessage } from "./errorMessage";
import LoadingSpinnerComponent from "react-spinners-components";

export default function ({ id, type }: { id; type: "post" | "listing" }) {
  const { t } = useTranslate();
  const { data, error, loading, setdata } = useSupabaseQuery(
    supabase
      .from("comments")
      .select(
        "*,user:profiles!inner(avatar_url,full_name),replays:comments(*)",
        {
          count: "estimated",
          head: false,
        }
      )
      .eq(type == "listing" ? "listing_id" : "post_id", id)
      .limit(5)
      .order("created_at", { ascending: false })
  );
  console.log("comments query :>> ", data, error, loading);
  if (error) {
    return <ErrorMessage message="Something Wrong Happened!" />;
  }
  if (loading) {
    return (
      <LoadingSpinnerComponent type={'Infinity'} />
    );
  }
  return (
    <div className={"w-full flex flex-col items-center gap-2"}>


      <div className={"flex flex-col gap-4 w-full rounded-lg "}>
        <CommentWriter
          id={id}
          type={type}
          onSend={(comment) => setdata([comment, ...data,])}
        />
        {data ? data.map!((comment, index, array) => {
          return (
            <div className={"flex flex-col   mx-2 my-1  w-10/12"}>
              <div className={"flex flex-row items-end gap-1 text-sm text-muted-foreground"}>
                <Avatar className={"w-7 h-7"} src={comment.user.avatar_url} />
                <p className="">{comment.user.full_name}</p>
                .
                <p>{timeAgo(new Date(comment.created_at))}</p>
              </div>
              <p className={"text-lg ms-9"}>{comment.text}</p>
            </div>
          );
        }) : null}
        {!data ||
          (data?.length <= 0 && (
            <div className="p-10">
              <EmptyMessage message="No Comments Found" />
            </div>
          ))}

      </div>
    </div>
  );
}

function CommentWriter({
  id,
  type,
  replay_to,
  onSend,
}: {
  id;
  type: "listing" | "post";
  replay_to?: string;
  onSend?: (comment) => void;
}) {
  const [text, settext] = useState("");
  const [pending, setpending] = useState(false);
  const { t } = useTranslate();
  const [toast] = useIonToast();
  const navigate = useNavigate();

  async function hundleSend() {
    setpending(true);
    let user_id = await getuserid();
    if (!user_id)
      toast({
        message: "Please Sign In First",
        buttons: [
          {
            text: "Ok",
            handler: () => navigate("/signin?redirect_to=" + location.pathname),
          },
          { role: "cancel", text: "cancel" },
        ],
      });
    const { error } = await supabase.from("comments").insert({
      text,
      replay_to: replay_to || null,
      user_id,
      post_id: type == "post" ? id : null,
      listing_id: type == "listing" ? id : null,
    });
    if (!error) {
      settext("");
      toast(t("comment send"), 1000);
      let user = auth.getState().user;
      onSend &&
        onSend({
          text,
          replay_to: replay_to || null,
          user_id,
          post_id: type == "post" ? id : null,
          listing_id: type == "listing" ? id : null,
          created_at: new Date().toISOString(),
          user: {
            avatar_url: user.avatar_url,
            full_name: user.full_name,
          },
        });
    } else {
      console.log("comment send error :>> ", error);
      toast(t("comment not send please try again later"), 1000);
    }
    setpending(false);
  }
  return (
    <div
      className={
        "flex flex-row  gap-2 rounded-lg items-center px-4 py-1 shadow-sm border border-gray-300 m-2"
      }
    >
      <textarea
        className={"bg-inherit h-7 grow border-none outline-none "}
        onChange={(e) => settext(e.currentTarget.value)}
        value={text}
      />
      <button onClick={hundleSend} disabled={pending}>
        {pending ? <IonSpinner /> : t("Send")}
      </button>
    </div>
  );
}
