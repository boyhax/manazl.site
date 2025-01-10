import { auth } from "src/state/auth";

import Page from "src/components/Page";
import ExperiencesSection from "src/components/landing/ExperiencesSection";
import FeaturedSection from "src/components/landing/FeaturedSection";
import TestimonialsSection from "src/components/landing/FeaturedPosts";
import SearchBar from "src/components/SearchBar";
import NavigationFAB from "src/components/landing/navigationFAB";
import { IonContent } from "@ionic/react";

export default function () {
  const { user } = auth();


  return (
    <Page title="Playground">
      <IonContent className="min-h-screen bg-gray-50">
        <div className="p-4 ">
          <div className="w-full flex justify-center">
            <SearchBar />
          </div>

          <FeaturedSection />
          <ExperiencesSection />
          <TestimonialsSection />
        </div>
      </IonContent>

      
    </Page>
  );
}
