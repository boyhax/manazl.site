import { createClient } from "@/app/lib/supabase/client";

// export async function generateStaticParams() {
//   const client = createClient();
//   let { data: posts } = await client.from("listings").select("short_id");
//   if (!posts) return [];
//   return posts.map((post) => ({
//     id: post.short_id,
//   }));
// }

// export async function generateMetadata({ params }: { params: { id: string } }) {
//   const client = createClient();
//   let { data: post } = await client
//     .from("listings")
//     .select("title,description,images")
//     .eq("short_id", params.id)
//     .single();
//   if (!post) return { title: "Manazl" };
//   return {
//     title: post.title + " Manazl ",
//     description: post.description,
//     openGraph: {
//       title: post.title + " Manazl.site ",
//       description: post.description,
//       images: post.images,
//     },
//   };
// }
export default async function Layout({ children }) {
  return children;
}
