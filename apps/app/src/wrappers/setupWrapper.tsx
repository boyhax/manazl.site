import { App, URLOpenListenerEvent } from "@capacitor/app";

import { useEffect } from "react";
import { useIonToast, useIonAlert } from "@ionic/react";
import { useNavigate } from "react-router";
import { loadPush, notifications } from "src/state/Notifications";
import { authSubscripe } from "src/state/auth";

export default function SetupScript({ children }) {
  const navigate = useNavigate();
  const [toast] = useIonToast();
  const [alert] = useIonAlert();
  useEffect(() => {
    try {
      loadPush();
      authSubscripe(navigate);
      notifications.subscribe((s, prev) => {
        if (s.notifications.length > prev.notifications.length) {
          //new notification
          const not = s.notifications.pop();
          //notification for notifcation
          if (!not.data) alert(not.title);
        }
      });
      document.addEventListener("ionBackButton", (ev: any) => {
        ev.detail.register(-1, () => {
          if (location.pathname.includes("/home")) {
            App.exitApp();
          } else {
            navigate("..");
          }
        });
      });
      App.addListener("appStateChange", ({ isActive }) => {
      });
      

      App.addListener("appRestoredResult", (data) => {
        console.log("Restored state:", data);
      });
      App.addListener("appUrlOpen", (event: URLOpenListenerEvent) => {
        // Example url: https://beerswift.app/tabs/tab2
        // slug = /tabs/tab2
        let url = new URL(event.url);
        let host = url.hostname;
        // const hash = new URLSearchParams(url.hash);
        const slug = event.url.split(host).pop();
        // const pathname = url.pathname;
        if (slug) {
          navigate(slug);
          console.log("slug from AppUrlListener :>> ", slug);
        }
  
        
      });
    } catch (error) {

      console.log("error from setup script :>> ", error);
    }
    
  }, []);
  return children;
}
