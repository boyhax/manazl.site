import { useTranslate } from "@tolgee/react";
import { useNavigate, useParams } from "react-router";
import Page, {
  Header,
  HeaderBackButton,
  HeaderTitle,
  MainContent,
} from "src/components/Page";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "src/components/ui/tabs";
import HostReservationsView from "./views/hostReservationsView";
import UserReservationsView from "./views/userReservationsView";



export default function () {
  const view = useParams().view || "self";
  const navigate = useNavigate();
  const { t } = useTranslate();


  return (
    <Page>
      <Header>
        <HeaderBackButton to='/account?view=reservations' />
        <HeaderTitle>{t("Reservations")}</HeaderTitle>
      </Header>
      <MainContent>
        <Tabs value={view} defaultValue={"self"} onValueChange={(v) => navigate(`/reservations/${v}`)}>
          <TabsList>
            <TabsTrigger value="self">{t("My Reservations")}</TabsTrigger>
            <TabsTrigger value="host">{t("Host Reservations")}</TabsTrigger>
          </TabsList>
          <TabsContent value="self">
            <UserReservationsView />
          </TabsContent>
          <TabsContent value="host">
            <HostReservationsView />
          </TabsContent>
        </Tabs>
      </MainContent>
    </Page>
  );
}
