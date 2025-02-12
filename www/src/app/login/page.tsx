
import Page, { Header, HeaderBackButton, MainContent } from "src/components/Page";
import AuthView from "./authView";
import { redirect, useRouter } from "next/navigation";
import { createClient } from "../lib/supabase/server";

export default async function AuthPage() {

  const client = createClient()
  const { data, error } = await client.auth.getUser();

  if (!!data.user) {
    redirect('/account');
  }

  return (
    <Page>

      <MainContent className={"w-full items-center justify-center py-2"}>
        <AuthView />
      </MainContent>
    </Page>
  );
}
