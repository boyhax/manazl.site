import HostCard from "../components/HostCard";

import {
  IonContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonProgressBar,
} from "@ionic/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useTranslate } from "@tolgee/react";
import { EmptyMessage } from "src/components/errorMessage";
import { ScrollArea } from "src/components/ui/scroll-area";
import useScrollY from "src/hooks/useScrollY";
import useSearchfilter from "src/hooks/useSearchFilter";
import { listingfilter } from "src/lib/db/listings";
import { getListings } from "src/state/search";

let limit = 20;

export default function () {

  const { t } = useTranslate();
  const { filter } =
    useSearchfilter<listingfilter>();
  async function searchListings({ pageParam }) {

    const data = await getListings(
      {
        ...filter,
        page: pageParam,
        limit,
      },
    );

    console.log('data,error', data)
    return data;
  }

  const {
    data,
    isError,
    isLoading,
    hasNextPage,
    fetchNextPage: getMore,
  } = useInfiniteQuery({
    queryKey: ["listings", filter],
    queryFn: searchListings,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage: number | undefined = lastPage?.length == limit
        ? allPages?.length
        : undefined;

      return nextPage;
    },
  });
  const { setVisible } = useScrollY();
  return (
    <IonContent
      scrollEvents
      onIonScroll={(e) =>
        e.detail.velocityY != 0 ? setVisible(e.detail.velocityY < 0) : null
      }
      className={"scroll-smooth ion-padding mx-auto"}
    >
      <ScrollArea>
        {isLoading ? <IonProgressBar type={"indeterminate"} /> : null}
        {!isLoading && data?.pages[0].length == 0 && (
          <div className={"w-full px-5  text-center "}>
            <EmptyMessage message={t("No Result Found")} />
          </div>
        )}
        <div
          className={
            "flex flex-col  justify-start items-center gap-2 w-full max-w-sm mx-auto "
          }
        >
          {data
            ? data.pages
              .reduce((acc, cur) => acc.concat(cur), [])
              .map((item, key: number) => (
                <HostCard
                  key={key}
                  data={{
                    ...item,
                    cost: item?.rooms?.available?.sum || null,
                  }}
                />
              ))
            : null}
          <div className={"h-5"} />
        </div>

        <IonInfiniteScroll
          onIonInfinite={async (ev) => {
            await getMore();
            ev.target.complete();
          }}
          hidden={hasNextPage == false}
        >
          <IonInfiniteScrollContent
            loadingSpinner={"bubbles"}
          ></IonInfiniteScrollContent>
        </IonInfiniteScroll>
      </ScrollArea>
    </IonContent>
  );
}
