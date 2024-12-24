import "./global.css";

import React from "react";
import { createRoot } from "react-dom/client";

import {
  BackendFetch,
  DevTools,
  FormatSimple,
  Tolgee,
  TolgeeProvider,
} from "@tolgee/react";
import App from "./App";
import LoadingScreen from "./components/LoadingScreen";
import reportWebVitals from "./reportWebVitals";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

import ar from "src/lib/transulations/ar.json";
import en from "src/lib/transulations/en.json";

const tolgee = Tolgee()
  .use(DevTools())
  .use(FormatSimple())
  .use(
    BackendFetch({
      prefix: "https://cdn.tolg.ee/5a3e507bbe8d15821632432a003addf5",
    })
  )
  .init({
    language: "ar",
    fallbackLanguage: "en",
    onTranslationMissing: (info) => {
      console.debug("missing transulation :>> ", info);
      return info.key;
    },
    availableLanguages: ["ar", "en"],
    // for development
    apiUrl: import.meta.env.VITE_APP_TOLGEE_API_URL,
    apiKey: import.meta.env.VITE_APP_TOLGEE_API_KEY,

    // for production
    staticData: {
      ar,
      en,
    },
  });

const container = document.getElementById("root");
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <TolgeeProvider tolgee={tolgee} fallback={<LoadingScreen />}>
      <App />
    </TolgeeProvider>
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
