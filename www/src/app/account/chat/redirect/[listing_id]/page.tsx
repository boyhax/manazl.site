import { getChatId } from "@/app/account/chat/actions/chat.server";
import { redirect } from "next/navigation";


export default async function RedirectRoute({ params: { listing_id } }) {
  const { id } = await getChatId({ listing_id })
  redirect('/account/chat/' + id)

}
