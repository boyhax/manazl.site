import { getuserid } from "src/lib/db/auth";
import supabase, { SupabaseFilterBuilder } from "src/lib/supabase";
import { create } from "zustand";
import { combine, devtools, persist } from "zustand/middleware";
import { auth } from "./auth";

export const usePosts = create(
  devtools(
    persist(
      combine(
        {
          builder(query: SupabaseFilterBuilder) {
            return query;
          },
          loading: false,
          posts: [],
          hasMore: false,
          count: 0,
          async getPosts(
            builder: (query: SupabaseFilterBuilder) => SupabaseFilterBuilder
          ) {
            usePosts.setState({ loading: true, builder });

            var query = supabase
              .from("posts")
              .select("*,user:profiles!inner(avatar_url,full_name)", {
                count: "exact",
              })
              .limit(30);
            query = builder(query);
            const { data, error, count } = await query;
            const hasMore = count > data.length;
            usePosts.setState({
              loading: false,
              posts: data || [],
              hasMore,
              count,
            });
          },
          async getMorePosts() {
            if (!usePosts.getState().hasMore) return;
            usePosts.setState({ loading: true });
            var query = supabase
              .from("posts")
              .select("*,user:profiles!inner(avatar_url,full_name)");
            query = usePosts.getState().builder(query);
            const { data, error } = await query;
            const count = usePosts.getState().count;
            const currentPosts = usePosts.getState().posts;
            const currentLength = usePosts.getState().count;
            const hasMore = data ? count > data.length + currentLength : false;
            usePosts.setState({
              loading: false,
              posts: [...currentPosts, ...data],
              hasMore,
            });
          },
        },
        (set, get) => ({})
      ),
      { name: "usePosts" }
    ),
    { name: "usePosts" }
  )
);
export async function deletepost(id) {
  const { error } = await supabase.from("posts").delete().eq("id", id);
  !error &&
    usePosts.setState((prev) => {
      const posts = prev.posts.filter((value) => value.id != id);
      return { ...prev, posts };
    });
  return { error };
}
export async function reportpost(id,report) {
  const { error } = await supabase.from("post_reports").insert({post_id:id,...report})
  !error &&
    usePosts.setState((prev) => {
      const posts = prev.posts.filter((value) => value.id != id);
      return { ...prev, posts };
    });
  return { error };
}
export async function createPost(post) {
  let user_id = await getuserid();
  if(!user_id)return {error:{message:'user not signed in'}}
  const { error } = await supabase.from("posts").insert({ ...post, user_id });
  !error &&
    usePosts.setState((prev) => {
      const {full_name,avatar_url}= auth.getState().user 
      const post = {...postMessage,user:{full_name,avatar_url},id:prev.count+1*100}
       prev.posts = [post,...prev.posts];
      return prev;
    });
  return { error };
}
