
import { useTranslate } from "@tolgee/react";
import {
  MainContent
} from "src/components/Page";
import UserReservationsView from "./views/userReservationsView";
import { useParams, useRouter } from "next/navigation";



export default function Page_() {


  return (

    <MainContent className="container w-full px-4 sm:px-10 ">
      <UserReservationsView />
    </MainContent>

  );
}
