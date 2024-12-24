import { useIonToast } from "@ionic/react";
import { useTranslate } from "@tolgee/react";
import React, { useState } from "react";
import { FunctionComponent } from "react";
import { getuserid } from "src/lib/db/auth";
import supabase from "src/lib/supabase";

interface FeedBackViewProps {}
async function sendFeedback(value: { message: string; contact: string }) {
  const user_id = (await getuserid()) || "anon";
  return await supabase.from("feedbacks").insert({
    user_id,
    ...value,
    type: "casual",
  });
}
export default function ({ onsend }: { onsend: () => void }) {
  const { t } = useTranslate();
  const [data, setdata] = useState({
    message: "",
    contact: "",
  });
  const [toast] = useIonToast();
  const [pending, setpending] = useState(false);
  const [happines, sethappines] = useState<"happy" | "unhappy">();
  async function submit() {
    setpending(true);
    const { error } = await sendFeedback(data);
    setpending(false);
    toast(
      t(
        error
          ? "error happen" + error.message
          : "Thank You ,Your Feedback Recived"
      ),
      1500
    );
    onsend();
  }
  return (
    <div className="bg-background  grid grid-cols-6 gap-2 rounded-xl p-2 text-sm">
      <h1 className="text-center text-slate-600 text-xl font-bold col-span-6">
        {t("Send Feedback")}
      </h1>
      <input
        value={data.contact}
        onChange={(e) => setdata({ ...data, contact: e.currentTarget.value })}
        className="bg-light text-text h-10 placeholder:text-text placeholder:opacity-50 border border-background_tent col-span-6 resize-none outline-none rounded-lg p-2 duration-300 focus:border-2"
        placeholder="Your Email,Phone..."
      ></input>
      <textarea
        value={data.message}
        onChange={(e) => setdata({ ...data, message: e.currentTarget.value })}
        className="bg-light text-text h-28 placeholder:text-text placeholder:opacity-50 border border-background_tent col-span-6 resize-none outline-none rounded-lg p-2 duration-300 focus:border-2"
        placeholder="Your feedback..."
      ></textarea>
      <button
        onClick={(e) => sethappines("happy")}
        className="fill-text col-span-1 bg-light flex justify-center items-center rounded-lg p-2 duration-300  hover:border-slate-300 focus:fill-blue-200 focus:bg-blue-600 border border-slate-600"
      >
        <svg
          viewBox="0 0 512 512"
          height="20px"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm177.6 62.1C192.8 334.5 218.8 352 256 352s63.2-17.5 78.4-33.9c9-9.7 24.2-10.4 33.9-1.4s10.4 24.2 1.4 33.9c-22 23.8-60 49.4-113.6 49.4s-91.7-25.5-113.6-49.4c-9-9.7-8.4-24.9 1.4-33.9s24.9-8.4 33.9 1.4zM144.4 208a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm192-32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"></path>
        </svg>
      </button>
      <button
        onClick={(e) => sethappines("unhappy")}
        className="fill-text col-span-1 flex bg-light justify-center items-center rounded-lg p-2 duration-300  hover:border-slate-300 focus:fill-blue-200 focus:bg-blue-600 border border-slate-600"
      >
        <svg
          viewBox="0 0 512 512"
          height="20px"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM174.6 384.1c-4.5 12.5-18.2 18.9-30.7 14.4s-18.9-18.2-14.4-30.7C146.9 319.4 198.9 288 256 288s109.1 31.4 126.6 79.9c4.5 12.5-2 26.2-14.4 30.7s-26.2-2-30.7-14.4C328.2 358.5 297.2 336 256 336s-72.2 22.5-81.4 48.1zM144.4 208a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm192-32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"></path>
        </svg>
      </button>
      <span className="col-span-2"></span>
      <button
        disabled={pending}
        onClick={submit}
        className="col-span-2   bg-light  stroke-slate-900 dark:stroke-slate-100  focus:stroke-blue-200 focus:bg-blue-600 border border-slate-600 hover:border-slate-300 rounded-lg p-2 duration-300 flex justify-center items-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30px"
          height="30px"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M7.39999 6.32003L15.89 3.49003C19.7 2.22003 21.77 4.30003 20.51 8.11003L17.68 16.6C15.78 22.31 12.66 22.31 10.76 16.6L9.91999 14.08L7.39999 13.24C1.68999 11.34 1.68999 8.23003 7.39999 6.32003Z"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
          <path
            d="M10.11 13.6501L13.69 10.0601"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
        </svg>
      </button>
    </div>
  );
}
