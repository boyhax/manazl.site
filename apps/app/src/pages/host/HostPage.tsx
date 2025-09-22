import {
  IonContent
} from "@ionic/react";

import { useTranslate } from "@tolgee/react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "src/components/ui/card";
import { Separator } from "src/components/ui/separator";
import useMyListing from "src/hooks/useMyListing";

export default function () {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslate();
  const { listing } = useMyListing()
  const page = location.pathname.split("/")[2] ?? "";
  const segment = page;

  return (
    <IonContent>
      <Card
        className="max-w-xs" x-chunk="charts-01-chunk-4"
      >
        <CardHeader>
          <CardTitle>My Host</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4 p-4 pb-2">
          {/* <IonImg src={listing.thumbnail}/> */}
        </CardContent>
        <CardFooter className="flex flex-row border-t p-4">
          <div className="flex w-full items-center gap-2">
            <div className="grid flex-1 auto-rows-min gap-0.5">
              <div className="text-xs text-muted-foreground">Move</div>
              <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                562
                <span className="text-sm font-normal text-muted-foreground">
                  kcal
                </span>
              </div>
            </div>
            <Separator orientation="vertical" className="mx-2 h-10 w-px" />
            <div className="grid flex-1 auto-rows-min gap-0.5">
              <div className="text-xs text-muted-foreground">Exercise</div>
              <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                73
                <span className="text-sm font-normal text-muted-foreground">
                  min
                </span>
              </div>
            </div>
            <Separator orientation="vertical" className="mx-2 h-10 w-px" />
            <div className="grid flex-1 auto-rows-min gap-0.5">
              <div className="text-xs text-muted-foreground">Stand</div>
              <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                14
                <span className="text-sm font-normal text-muted-foreground">
                  hr
                </span>
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>

      <Outlet />
    </IonContent>
  );
}
