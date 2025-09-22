import { IonProgressBar } from "@ionic/react";
import Page from "src/components/Page";

import { auth } from "src/state/auth";

import { useTranslate } from "@tolgee/react";
import { Outlet, useNavigate } from "react-router-dom";

export default function () {
  const { session, loading } = auth();

  const { t } = useTranslate();
  const navigate = useNavigate();
  const page = location.pathname.split("/").pop();
  const segment = page == "account" ? "bookings" : page;
  if (loading) {
    return <IonProgressBar type={"indeterminate"} />;
  }

  return (
    <Page>
      <Outlet />
    </Page>
  );
}
