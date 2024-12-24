// import { IonContent, IonLabel, IonSpinner } from "@ionic/react";
// import { useMemo } from "react";
// import { useParams } from "react-router";
// import Avatar from "src/components/Avatar";
// import BackButton from "src/components/BackButton";
// import Img from "src/components/Image";
// import useSupabaseQuery from "src/hooks/useSupabaseQuery";
// import supabase from "src/lib/supabase";
// import Page from "../components/Page";

// const PostPage = () => {
//   const params = useParams();
//   const id = params?.id ?? null;
//   const query = useMemo(
//     () =>
//       supabase
//         .from("posts")
//         .select("*,profiles(avatar_url,full_name)")
//         .eq("id", id)
//         .single(),
//     [params]
//   );
//   const { data, error, loading } = useSupabaseQuery(query);
//   if (error) {
//     console.trace(error);
//     throw new Error(error);
//   }
//   let date = new Date(data?.created_at).toLocaleDateString("en-us", {
//     weekday: "long",
//     year: "numeric",
//     month: "short",
//     day: "numeric",
//   });

//   return (
//     <Page>
//       <BackButton to={-1} fab />
//       {!loading ? (
//         <Post
//           post={
//             {
//               ...data,
//               author: data?.profiles?.full_name,
//               avatar_url: data?.profiles?.avatar_url,
//               created_at: date,
//               image_url: data.url,
//             } as Post
//           }
//         />
//       ) : (
//         <div
//           className={"w-full h-64 max-w-sm flex items-center justify-center"}
//         >
//           <IonSpinner />
//         </div>
//       )}
//     </Page>
//   );
// };
// export default PostPage;

// export interface Post {
//   id: string;
//   title: string;
//   body: string;
//   user_id: string;
//   image_url?: string;
//   avatar_url?: string;
//   author?: string;
//   created_at: string;
// }

// const Post = ({ post }: { post: Post }) => {
//   return (
//     <IonContent>
//       <Img
//         className={"max-h-60 object-contain overflow-hidden"}
//         src={post.image_url}
//         fallback={<p>no image</p>}
//       />
//       <div className={"flex flex-row items-center space-x-2 start-2"}>
//         <Avatar slot={"start"} src={post.avatar_url} />
//         <IonLabel>
//           <h2 className={""}>{post.author}</h2>
//           <h4>{post.created_at}</h4>
//         </IonLabel>
//       </div>

//       <article className="prose lg:prose-xl">
//         <h1 className={"m-4 text-3xl"}>{post.title}</h1>
//         <p className={"m-3 "}>{post.body}</p>
//       </article>
//     </IonContent>
//   );
// };

