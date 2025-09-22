import {
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuToggle,
  IonPage,
  IonTitle,
} from "@ionic/react";
import { Outlet, useLocation } from "react-router";
import { Link } from "react-router-dom";
import Header from "src/components/Header";
import { Button } from "src/components/ui/button";
import { decodeToken, useJwt } from "react-jwt";

const token = import.meta.env.VITE_APP_SUPABASE_ANON_KEY;

export default function () {
  const { pathname } = useLocation();
  const routes = pathname.split("/");
  const pagename = routes.pop();
  const decodedToken = decodeToken(token)
  const service_role =
      decodedToken && decodedToken["role"] === "service_role";
   
   
  if (service_role) {
    console.log("admin User :>> ");
  } else {
    throw Error("Bad User Privilge");
  }

  return (
    <IonPage>
      <Header>
        <IonTitle>{pagename}</IonTitle>
      </Header>

      <IonContent id={"content"}>
        <div dir={"ltr"} className={"flex flex-row h-full"}>
          <div id={"sideebarcontainer"}>
            <SideMenu />
          </div>
          <div className={"w-full grow"}>
            <Outlet />
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}

function SideMenu() {
  return (
    <div className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2">
      <nav className="grid gap-1 px-2">
        <Button
          variant="ghost"
          size="sm"
          className="justify-start gap-2"
          asChild
        >
          <Link to="/admin" className="gap-2">
            <InboxIcon className="w-4 h-4" />
            Inbox
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="justify-start gap-2"
          asChild
        >
          <Link to="users" className="gap-2">
            <FileIcon className="w-4 h-4" />
            Users
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="justify-start gap-2"
          asChild
        >
          <Link to="#" className="gap-2">
            <SendIcon className="w-4 h-4" />
            Sent
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="justify-start gap-2"
          asChild
        >
          <Link to="#" className="gap-2">
            <Trash2Icon className="w-4 h-4" />
            Trash
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="justify-start gap-2"
          asChild
        >
          <Link to="#" className="gap-2">
            <ArchiveIcon className="w-4 h-4" />
            Archived
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="justify-start gap-2"
          asChild
        >
          <Link to="#" className="gap-2">
            <ArchiveXIcon className="w-4 h-4" />
            Spam
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="justify-start gap-2"
          asChild
        >
          <Link to="#" className="gap-2">
            <UsersIcon className="w-4 h-4" />
            Contacts
          </Link>
        </Button>
      </nav>
    </div>
  );
}

function ArchiveIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="5" x="2" y="3" rx="1" />
      <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" />
      <path d="M10 12h4" />
    </svg>
  );
}

function ArchiveXIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="5" x="2" y="3" rx="1" />
      <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" />
      <path d="m9.5 17 5-5" />
      <path d="m9.5 12 5 5" />
    </svg>
  );
}

function FileIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </svg>
  );
}

function InboxIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  );
}

function SendIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}

function Trash2Icon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <line x1="10" x2="10" y1="11" y2="17" />
      <line x1="14" x2="14" y1="11" y2="17" />
    </svg>
  );
}

function UsersIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
