

import { ScrollArea } from "@/components/ui/scroll-area";
import { defaultValues } from "../components/listingForm.types";
import { Suspense } from "react";
import LoadingSpinnerComponent from "react-spinners-components";
import dynamic from "next/dynamic";

const ListingForm = dynamic(
  () => import('../components/listingForm'),
  { ssr: false }
)



export default async function NewHost() {

  return (
    <ScrollArea >
      <Suspense fallback={<LoadingSpinnerComponent></LoadingSpinnerComponent>}>

        <ListingForm initialValues={defaultValues} />

      </Suspense>
    </ScrollArea>
  );
}
