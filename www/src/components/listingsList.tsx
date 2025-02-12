'use client'
import HostCard from "src/components/HostCard";
import { useInfiniteQuery } from "@tanstack/react-query";
import { EmptyMessage } from "src/components/errorMessage";
import { ScrollArea } from "src/components/ui/scroll-area";
import LoadingSpinnerComponent from 'react-spinners-components';
import useSearchfilter from "src/hooks/useSearchFilter";
import { listingfilter } from "src/lib/db/listings";
import { getListings } from "@/lib/search";
import InfiniteScroll from "./infinteScroll";

let limit = 10;

export default function ListingList() {

    const { filter } =
        useSearchfilter<listingfilter>();

    async function searchListings({ pageParam }: any) {
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
        fetchNextPage,
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

    return (

        <ScrollArea className="overflow-auto h-[75vh] px-4  ">
            {isLoading ? <LoadingSpinnerComponent type={'Infinity'} color={'red'} size={'10rem'} /> : null}
            {!isLoading && data?.pages[0].length == 0 && (
                <div className={"w-full px-5  text-center "}>
                    <EmptyMessage message={"No Result Found"} />
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
                        .map((item: any, key: number) => (
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

            <InfiniteScroll loadMore={fetchNextPage} hasNextPage={hasNextPage} />

        </ScrollArea>

    );
}
