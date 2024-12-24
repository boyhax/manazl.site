import React, { useEffect, useState } from "react";
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
import { useMediaQuery } from "usehooks-ts";

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

export default function TabBar() {
  const { pathname } = useLocation();
  const path = pathname.split("/")[1] || "/";
  const { visible } = useScrollY();
  const { t } = useTranslate();
  const mdsize = useMediaQuery("(min-width:768px)");
  const {set,unset} = useSetSafeMargin({ safe_margin_bottom: visible ? 64 : 0 });

  const [activeTab, setActiveTab] = useState("account");
  set()
  if (path == "chat" || mdsize) {
    unset()
    return null;
  }

  return (
    <IonFooter
      className={`fixed bottom-0 left-0 right-0 bg-background border-t border-border transition-all w-full max-w-md mx-auto  md:hidden md:rounded-lg md:drop-shadow-sm md:border  ${!visible ? "translate-y-[100%] block absolute bottom-0 " : "translate-y-0 "}`}
    >
      <nav className="flex justify-around items-center h-16">
        {tabs.map((tab) => (
          <Link to={tab.path} key={tab.path}>
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full transition-colors",
                path === tab.path
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary"
              )}
              aria-selected={activeTab === tab.id}
            >
              {tab.icon}
              <span className="text-xs mt-1">{t(tab.label)}</span>
            </button>
          </Link>
        ))}
      </nav>
    </IonFooter>
  );
}

function useSetSafeMargin({ safe_margin_bottom }) {
  function _do() {
    //set css var --safe-margin-bottom
    document.documentElement.style.setProperty(
      "--safe-margin-bottom",
      `${safe_margin_bottom}px`
    );
  }
  function _undo() {
    //undo set css var --safe-margin-bottom
    document.documentElement.style.removeProperty("--safe-margin-bottom");
  }

  useEffect(() => {
    _do();
    return _undo;
  }, [safe_margin_bottom]);
  return {set:_do,unset:_undo};
}
