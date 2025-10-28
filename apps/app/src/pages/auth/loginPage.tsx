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
      <main className="flex flex-col items-center justify-center min-h-[80vh] bg-gray-50 px-4">
        <div className="flex flex-col items-center mb-8">
          <img className="m-auto w-24 h-24 rounded-lg shadow-md" src="/assets/icon.png" alt="Description" />
          <h3 className="text-center text-2xl font-semibold mt-4">Welcome to Manazl</h3>
        </div>
        <div className="w-full max-w-md">
          <AuthView />
        </div>
      </main>
    </Page>
  );
}
