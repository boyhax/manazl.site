import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Page, { Header, HeaderBackButton } from "src/components/Page";
import AuthView from "src/pages/auth/authView";
import { auth } from "src/state/auth";

export default function () {
  const { session } = auth();
  const navigate = useNavigate();
  const hasPreviousPage = window.history.length > 1;
  if (!!session) {
     navigate(-1);
  }

  return (
    <Page>
      <Header>
        <HeaderBackButton/>
      </Header>
      <div className={"w-full h-full flex justify-center items-center p-4 sm:p-8"}>
        <AuthView />
      </div>
    </Page>
  );
}
