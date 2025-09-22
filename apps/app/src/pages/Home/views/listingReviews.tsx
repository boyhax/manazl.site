import {
  IonAvatar,
  IonItem,
  IonLabel,
  IonList,
  IonSkeletonText
} from "@ionic/react";
import { key } from "ionicons/icons";
import supabase from "src/lib/supabase";

import { BiSolidStar, BiSolidStarHalf, BiStar } from "react-icons/bi";
import ReactStars from "react-rating-stars-component";
import Avatar from "src/components/Avatar";
import useSupabaseQuery from "src/hooks/useSupabaseQuery";

const listingReviews = ({ id, children }: { id: string; children?: any }) => {
  const {
    data: ratings,
    error,
    loading,
    count,
  } = useSupabaseQuery(
    supabase
      .from("ratings")
      .select("*,listings(rating),profiles(avatar_url,full_name)", {
        count: "exact",
      })
      .eq("listing_id", id)
      .order("created_at", { ascending: false })
      .limit(10)
  );

  // useEffect(() => {
  //   console.log(
  //     "data--count from listing reviews :>> ",
  //     ratings,
  //     " -- ",
  //     error,
  //     " -- ",
  //     loading,
  //     " -- ",
  //     count
  //   );
  // }, [ratings]);

  if (loading) {
    return <Placeholder />;
  }
  if (error) {
    return <></>;
  }

  return (
    <IonList key={key} className={"animate-fade-up ion-padding"}>
      {children}
      {ratings.map((rating, index, array) => {
        return (
          <IonItem key={index}>
            <Avatar slot="start" src={rating?.profiles?.avatar_url}/>
            
            <IonLabel>
            <h5>{rating?.profiles?.full_name}</h5>
              {/* <div className={"flex flex-row justify-between items-center"}> */}
                {/* <p>{rating?.profiles?.full_name}</p> */}
                {/* <ReactStars
                  className={"px-2"}
                  count={5}
                  size={20}
                  edit={false}
                  value={(rating?.rating || 0) / 20}
                  emptyIcon={<BiStar />}
                  halfIcon={<BiSolidStarHalf />}
                  fullIcon={<BiSolidStar />}
                /> */}
              {/* </div> */}
              <h4>{rating?.text}</h4>
            </IonLabel>
          </IonItem>
        );
      })}
    </IonList>
  );
};

export default listingReviews;

const Placeholder = () => {
  return (
    <IonList key={key} className={"animate-fade-up ion-padding"}>
      <IonItem>
        <IonAvatar slot="start">
          <IonSkeletonText />
        </IonAvatar>
        <IonLabel>
          <p>
            <IonSkeletonText />
          </p>
          <h5>
            <IonSkeletonText />
          </h5>
        </IonLabel>
        <ReactStars
          className={"px-2 z-10"}
          count={5}
          size={20}
          edit={false}
          value={0}
          emptyIcon={<BiStar />}
          halfIcon={<BiSolidStarHalf />}
          fullIcon={<BiSolidStar />}
        />
      </IonItem>
    </IonList>
  );
};
