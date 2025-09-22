'use client'
import { useTranslate } from "@tolgee/react";
import { useState } from "react";
import LoadingSpinnerComponent from "react-spinners-components";

import useSupabaseQuery from "src/hooks/useSupabaseQuery";
import { getuserid } from "src/lib/db/auth";
import supabase from "src/lib/supabase";
import { timeAgo } from "src/lib/utils/timeAgo";
import { Label } from "./ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { EmptyMessage } from "./errorMessage";



export default function CommentsSection({ id, type }: { id: string; type: "post" | "listing" }) {
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
    return null;
  }
  if (loading) {
    return (
      <LoadingSpinnerComponent type={'Ball'} />
    );
  }
  return (
    <div className={"w-full flex flex-col items-center gap-2"}>
      <Label className={"text-xl text-center"}>
        {data?.count}
      </Label>

      <div className={"w-full rounded-lg divide-y divide-gray-400"}>
        {/* <CommentWriter
          id={id}
          type={type}
          onSend={(comment) => setdata([comment,...data, ])}
        /> */}
        {data ? data.map!((comment: any) => {
          return (
            <div className={"flex flex-col   mx-2 my-1  w-10/12"}>
              <div className={"flex flex-row items-center gap-1"}>
                <Avatar className={"w-7 h-7"} >
                  <AvatarImage src={comment.user.avatar_url} />
                  <AvatarFallback>{comment.user.full_name || "NA"}</AvatarFallback>
                </Avatar>
                <p>{comment.user.full_name}</p>
                <small>{timeAgo(new Date(comment.created_at))}</small>
              </div>

              <p className={"text-lg ms-9"}>{comment.text}</p>
            </div>
          );
        }) : null}
        {!data ||
          (data?.length <= 0 && (
            <div className="p-10 m-auto">
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
  id: string;
  type: "listing" | "post";
  replay_to?: string;
  onSend?: (comment: any) => void;
}) {
  const [text, settext] = useState("");
  const [pending, setpending] = useState(false);
  const { t } = useTranslate();
  const { toast } = useToast();
  const navigate = useRouter();

  async function hundleSend() {
    setpending(true);
    let user_id = await getuserid();
    if (!user_id)
      toast({
        title: "Please Sign In First",
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
      toast({ title: t("comment send"), duration: 1000 });
      let user = ""
      onSend &&
        onSend({
          text,
          replay_to: replay_to || null,
          user_id,
          post_id: type == "post" ? id : null,
          listing_id: type == "listing" ? id : null,
          created_at: new Date().toISOString(),
          user: {
            avatar_url: "user.avatar_url",
            full_name: "user.full_name",
          },
        });
    } else {
      console.log("comment send error :>> ", error);
      toast({ title: t("comment not send please try again later"), duration: 1000 });
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
        {pending ? <LoadingSpinnerComponent /> : t("Send")}
      </button>
    </div>
  );
}
