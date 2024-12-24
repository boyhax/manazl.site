
import { FunctionComponent, useMemo } from "react";
import useSupabaseQuery from "src/hooks/useSupabaseQuery";
import supabase from "src/lib/supabase";
import { useTranslate } from "@tolgee/react";
import { EmptyMessage, ErrorMessage } from "src/components/errorMessage";
import { HeaderBackButton } from "@/components/Page";
import LoadingSpinnerComponent from "react-spinners-components";
import HostCard from "@/components/HostCard";
import { useUserContext } from "@/providers/userProvider";

interface MyListingsProps { }

const MyLiked: FunctionComponent<MyListingsProps> = () => {
  const { user } = useUserContext();

  const { t } = useTranslate()
  const {
    data: liked,
    error,
    loading,

  } = useSupabaseQuery(
    supabase
      .from("likes")
      .select("listings(*)")
      .eq("user_id", user?.id)
  );

  console.log('liked :>> ', liked);
  if (error) return <ErrorMessage message="Sorry Error Happend" />
  return (
    <div className="container mx-auto px-4 py-8 overflow-y-auto pb-16 scroll-smooth">

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
        <HeaderBackButton />
      </div>
      <div className={"flex flex-row flex-wrap  gap-1 w-full lg:p-5 md:p-3"}>
        {loading && <LoadingSpinnerComponent type={"Ball"} />}
        {!liked && (
          <div
            className={"flex flex-col items-center justify-center w-full mt-12"}
          >
            <EmptyMessage message={t("try to make likes")} />

          </div>
        )}
        {liked && liked.map((value: any, i: number) => {
          return <HostCard data={value.listings} key={"likedlisting" + i} />;
        })}
      </div>
    </div>
  );
};

export default MyLiked;
