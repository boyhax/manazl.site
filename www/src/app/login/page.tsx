
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
      <Header>
        <HeaderBackButton to="/" />
      </Header>
      <MainContent className={"w-full items-center justify-center"}>
        <AuthView />
      </MainContent>
    </Page>
  );
}
