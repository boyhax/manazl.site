import {
  IonApp
} from "@ionic/react";
import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
// import { IonReactRouter } from "@ionic/react-router";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

import "leaflet/dist/leaflet.css";
import 'leaflet-geosearch/dist/geosearch.css';

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/display.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
/* Theme variables */
import "./theme/variables.css";
/* Tailwind styles */
import "./theme/ionstyles.css";
import "./theme/styles.css";
import "./theme/tailwind.css";
/* Global CSS */
import "./global.css";

import "@ionic/react/css/ionic-swiper.css";

import "react-image-gallery/styles/css/image-gallery.css";
import "react-multi-carousel/lib/styles.css";

import "swiper/css";
import "swiper/css/effect-cube";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

import "leaflet/dist/leaflet.css";

import { setupIonicReact } from "@ionic/react";

import { OutputFormat, setDefaults } from "react-geocode";

import { ErrorBoundary, router } from "./router";
import { store } from "./state/Store";
import { useAppDirection } from "./hooks/useAppDirection";
setupIonicReact({});


const loader = new Loader({
  apiKey: import.meta.env.VITE_APP_google_key,
  version: "weekly",
  libraries: ["places"],
});
loader.importLibrary("places").then((res) => {
  store.setState({ placesloaded: true });
});

export const googleapi = loader;

// import function to register Swiper custom elements
import { register } from "swiper/element/bundle";
import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";
import { Loader } from "@googlemaps/js-api-loader";
import { useTolgee } from "@tolgee/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import useTheme from "./hooks/useTheme";
// register Swiper custom elements
register();

const queryClient = new QueryClient();

export default function () {
  const dir = useAppDirection();
  const { getLanguage } = useTolgee();
  const lang = getLanguage();
  const { setDark } = useTheme()
  useEffect(() => {
    setDefaults({
      key: import.meta.env.VITE_APP_google_key, // Your API key here.
      language: lang, // Default language for responses.
      // region: "OM",
      outputFormat: OutputFormat.JSON, // Default region for responses.
    });
  }, [lang]);
  useEffect(() => {
    setDark(false)
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <IonApp
        style={{
          direction: dir,
        }}
      >
        <Toaster />
        <RouterProvider router={router} fallbackElement={<ErrorBoundary />} />
      </IonApp>
    </QueryClientProvider>
  );
}
