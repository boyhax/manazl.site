import {
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPopover,
  IonProgressBar,
  IonTextarea,
  IonTitle,
  useIonToast,
} from "@ionic/react";
import { useTranslate } from "@tolgee/react";
import { useEffect, useState } from "react";
import { FaFeather } from "react-icons/fa6";
import { RiQuillPenFill } from "react-icons/ri";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Avatar from "src/components/Avatar";
import BackButton from "src/components/BackButton";
import Header from "src/components/Header";
import Img from "src/components/Image";
import Toolbar from "src/components/Toolbar";
import useSupabaseQuery from "src/hooks/useSupabaseQuery";
import { getuserid } from "src/lib/db/auth";
import supabase from "src/lib/supabase";
import { timeAgo } from "src/lib/utils/timeAgo";
import Page from "../components/Page";
import { Post } from "./PostPage";
import {
  ellipsisVerticalCircle,
  ellipsisVerticalCircleSharp,
  ellipsisVerticalSharp,
} from "ionicons/icons";
import { auth } from "src/state/auth";
import { createPost, deletepost, reportpost, usePosts } from "src/state/posts";

export default function () {
  const [params, setparams] = useSearchParams();
  const { t } = useTranslate();
  const [focused, setfocused] = useState(null);
  const { getMorePosts, getPosts, hasMore, loading, posts } = usePosts();

  useEffect(() => {
    getPosts((query) => query.order("created_at", { ascending: false }));
  }, [params]);

  return (
    <Page>
      <Header>
        <Toolbar>
          <IonButtons slot="end">
            <BackButton />
          </IonButtons>
          <IonTitle>{t("Posts")}</IonTitle>
        </Toolbar>
      </Header>
      {loading && <IonProgressBar type={"indeterminate"} />}
      <IonContent className={"ion-padding"}>
        {posts?.map((post, index, array) => {
          return (
            <PostCard
              key={post.id}
              post={{
                ...post,
                author: post.user.full_name,
                avatar_url: post.user.avatar_url,
              }}
              focused={focused}
              setfocus={setfocused}
            ></PostCard>
          );
        })}
        <div className={"mt-20"}></div>
        {!loading && posts.length <= 0 && (
          <h1 className={"text-center "}>{t("No Posts Found")}</h1>
        )}
        <IonInfiniteScroll
          onIonInfinite={async (ev) => {
            await getMorePosts();
            ev.target.complete();
          }}
          hidden={!hasMore}
        >
          <IonInfiniteScrollContent
            loadingSpinner={"bubbles"}
          ></IonInfiniteScrollContent>
        </IonInfiniteScroll>
      </IonContent>
      <IonFab horizontal={"end"} vertical={"bottom"}>
        <Link to={"/posts/create"}>
          <IonFabButton>
            <RiQuillPenFill size={"1.5rem"} />
          </IonFabButton>
        </Link>
      </IonFab>
    </Page>
  );
}
export function PageMakePost() {
  const { t } = useTranslate();
  const [pending, setpending] = useState(false);
  const [toast] = useIonToast();
  const navigate = useNavigate();
  const [post, setpost] = useState({
    title: "",
    body: "",
  });
  async function hundleSubmit() {
    setpending(true);
    if (!post.title) {
      toast(t("please fill title field"), 1000);
      setpending(false);
      return;
    }
    if (!post.body) {
      toast(t("please fill body field"), 1000);
      setpending(false);
      return;
    }
    const { error } = await createPost(post);
    let user_id = await getuserid();
    if (!error) {
      toast(t("Post published"), 1000);
      navigate(-1);
    } else {
      if (!user_id) {
        toast(t("Please sign in first"), 1000);
      } else toast(t("error happend please try later"), 1000);
      console.log("error :>> ", error);
    }
    setpending(false);
  }
  return (
    <Page>
      <Header>
        <Toolbar>
          <IonButtons slot="start">
            <BackButton to={"/posts"}></BackButton>
          </IonButtons>
          <IonTitle slot={"secondary"}>{t("Create Post")}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={hundleSubmit} disabled={pending}>
              {t("Publish")}
              <FaFeather size={"1.5rem"} />
            </IonButton>{" "}
          </IonButtons>
        </Toolbar>
      </Header>
      <IonContent class="ion-padding">
        <div className={"flex flex-col items-start w-full max-w-md gap-1 mt-5"}>
          <IonInput
            placeholder={"title"}
            value={post.title}
            onIonChange={(e) => setpost({ ...post, title: e.detail.value })}
            id="titleinput"
            shape={"round"}
            fill={"outline"}
            counter
            maxlength={100}
            minlength={10}
          />
          <IonTextarea
            placeholder={"write here"}
            value={post.body}
            onIonChange={(e) => setpost({ ...post, body: e.detail.value })}
            id="bodyinput"
            className={"grow h-full "}
            shape={"round"}
            counter
            maxlength={500}
            minlength={50}
            fill={"outline"}
          />
        </div>
      </IonContent>
    </Page>
  );
}
export const PostCard = ({
  post,
  setfocus,
  focused,
}: {
  post: Post;
  setfocus?;
  focused;
}) => {
  const { t } = useTranslate();
  const profile = auth((s) => s.profile);
  const owner = post.user_id == (profile ? profile.id : false);
  async function hundledelete() {
    const { error } = await deletepost(post.id);
  }
  async function hundlereport() {
    const report ={}
    const { error } = await reportpost(post.id,report);
  }
  
  return (
    <div
      onClick={() => setfocus(post.id)}
      className={
        "flex flex-col w-full max-w-sm rounded-lg shadow-md px-2 pt-5 pb-3 "
      }
    >
      <Img
        className={"max-h-60 object-contain overflow-hidden"}
        src={post.image_url}
        fallback={<p>no image</p>}
      />
      <div className={"flex flex-row items-center gap-2  relative"}>
        <Avatar slot={"start"} className={"w-10 h-10"} src={post.avatar_url} />

        <IonLabel>
          <h1>{post.author}</h1>
          <p> {timeAgo(new Date(post.created_at))}</p>
        </IonLabel>
        <IonIcon
          icon={ellipsisVerticalSharp}
          id={"sidemenu" + post.id}
          className={"absolute end-3 top-2 "}
        />
        
        <IonPopover
          trigger={"sidemenu" + post.id}
          className={"rounded-xl"}
          showBackdrop={false}
        >
          <div className={"flex flex-col p-1"}>
            {/* <IonItem> */}
            {owner && (
              <IonButton onClick={hundledelete} fill={"clear"}>
                {t("delete")}{" "}
              </IonButton>
            )}
            <IonButton onClick={hundlereport} fill={"clear"}>{t("report")} </IonButton>
            {/* </IonItem> */}
          </div>
        </IonPopover>
      </div>

      <article className="prose text-pretty">
        <label className={"text-2xl font-bold"}>{post.title}</label>
        <p
          className={`${focused == post.id ? "overflow-clip" : "line-clamp-3 overflow-hidden"}`}
        >
          {post.body}
        </p>
      </article>
    </div>
  );
};
