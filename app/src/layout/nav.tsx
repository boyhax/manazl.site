import React, { useState } from "react";
import {
  User,
  Search,
  Settings,
  MessageCircle,
  CalendarDays,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useScrollY from "../hooks/useScrollY";
import { IonFooter } from "@ionic/react";
import { useTranslate } from "@tolgee/react";

type Tab = {
  id: string;
  icon: React.ReactNode;
  label: string;
  path: string;
};

const tabs: Tab[] = [
  {
    id: "account",
    icon: <User className="w-5 h-5" />,
    label: "Account",
    path: "account",
  },
  {
    id: "reservations",
    icon: <CalendarDays className="w-5 h-5" />,
    label: "Reservations",
    path: "reservations",
  },
  {
    id: "search",
    icon: <Search className="w-5 h-5" />,
    label: "Search",
    path: "/",
  },

  {
    id: "settings",
    icon: <Settings className="w-5 h-5" />,
    label: "Settings",
    path: "settings",
  },
  {
    id: "chat",
    icon: <MessageCircle className="w-5 h-5" />,
    label: "Chat",
    path: "chat",
  },
];

export default function () {
  const { pathname } = useLocation();
  const path = pathname.split("/")[1] || "/";
  // const navigate = useNavigate();
  const { visible } = useScrollY();
  const { t } = useTranslate();
  const [activeTab, setActiveTab] = useState("account");
  if (path == "chat") return null;

  return (
    <nav className="gap-3 hidden items-center md:flex ">
      {tabs.map((tab) => (
        <Link
          to={tab.path}
          key={tab.path}
          onClick={() => setActiveTab(tab.id)}
          className={cn(
            "flex flex-col items-center justify-center w-full h-full transition-colors",
            path === tab.path
              ? "text-primary"
              : "text-muted-foreground hover:text-primary"
          )}
          aria-selected={activeTab === tab.id}
        >
          <div className={"flex  items-center gap-2"}>
            {tab.icon}
            <span className="text-lg mt-1">{t(tab.label)}</span>
          </div>
        </Link>
      ))}
    </nav>
  );
}
