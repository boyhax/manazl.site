import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonListHeader
} from "@ionic/react";
import { Link, useNavigate } from "react-router-dom";
import Avatar from "src/components/Avatar";
import Img from "src/components/Image";
import useSupabaseQuery from "src/hooks/useSupabaseQuery";
import supabase from "src/lib/supabase";
import { Post } from "src/pages/PostPage";
import ExploreLine from "./components/exploreLine";
import { useTranslate } from "@tolgee/react";
const query = supabase
  .from("posts")
  .select("*,profiles(avatar_url)")
  .limit(5)
  .order("created_at", { ascending: false });
const ExplorePosts = () => {
  const { data } = useSupabaseQuery(query);
  const {t} = useTranslate()

  const navigate = useNavigate();
  if (!data || !data.length) return null;
  const posts: Post[] = data.map(
    (value) =>
      ({
        author: value?.profiles?.full_name,
        avatar_url: value?.profiles?.avatar_url,
        title: value.title,
        ...value,
      }) as Post
  );
  return (
    <div>
      <IonListHeader className={"text-xl capitalize"}>{t("Posts")}</IonListHeader>
      <ExploreLine
        placeholder={"New Posts"}
        items={posts.map((post) => (
          <IonCard className={" "}>
            <Link className={"w-full"} to={"/posts/" + post.id}>
              <Img src={post.image_url} />{" "}
            </Link>
            {/* <div className={"flex flex-row"}> */}
            <IonCardHeader>
              <IonCardTitle>{post.title}</IonCardTitle>
              <IonCardSubtitle>{post.body}</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              <Avatar
                slot="start"
                className={"min-w-10 min-h-10"}
                src={post?.avatar_url}
              />
            </IonCardContent>

            {/* </div> */}
          </IonCard>
        ))}
      />
    </div>
  );
};

export default ExplorePosts;
