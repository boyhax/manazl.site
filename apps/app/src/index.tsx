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

// TypeScript declaration for window properties
declare global {
  interface Window {
    exportMissingTranslations: (language: string) => void;
    missingTranslations: Record<string, Record<string, string>>;
  }
}

// Storage for missing translations
const missingTranslations: Record<string, Record<string, string>> = {
  ar: {},
  en: {},
};

// Function to save missing translations to localStorage
const saveMissingTranslations = () => {
  localStorage.setItem('missingTranslations', JSON.stringify(missingTranslations));
  console.log('Missing translations saved to localStorage');
};

// Optional: Function to export missing translations as JSON file
const exportMissingTranslations = (language) => {
  const dataStr = JSON.stringify(missingTranslations[language], null, 2);
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

  const exportFileDefaultName = `missing_translations_${language}.json`;

  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};

// Expose functions to window for easy access in browser console
window.exportMissingTranslations = exportMissingTranslations;
window.missingTranslations = missingTranslations;

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
      console.log("missing transulation :>> ", info);

      // Store missing translation in our collection
      const { key, defaultValue } = info;

      // Only store if language is supported
      // Store either the default value or the key itself
      missingTranslations['ar'][key] = defaultValue || key;
      missingTranslations['en'][key] = defaultValue || key;

      // Save to localStorage after each new missing translation
      saveMissingTranslations();

      console.log(`Added missing translation for "${key}"`);


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
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
