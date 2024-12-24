import { IonCard, IonImg, IonLabel, IonSkeletonText } from "@ionic/react";

import { Share } from "@capacitor/share";
import { useTranslate } from "@tolgee/react";
import { BiErrorCircle, BiShare, BiStar } from "react-icons/bi";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";
import LikeButton from "src/components/LikeButton";
import getPathTo from "src/lib/utils/getPathTo";
import { useSearch } from "src/state/search";
import { Swiper, SwiperSlide } from "swiper/react";
import { ListingPreviewProps } from "src/lib/db/listings";


export default function ({data}) {


  const navigate = useNavigate();
  const { t } = useTranslate();
 
  let error = !data;
  
  if (error) {
    return <ErrorCard />;
  }

  const rating = (data?.rating / 20);

  return (
    <div
      key={data.id + "hostCard"}
      className="relative flex flex-col h-80 mb-10 w-full max-w-sm items-stretch  border border-gray-300 rounded-lg shadow-md  hover:bg-gray-100 "
    >
      <div
        className={
          "absolute flex flex-col items-center gap-1 top-3 left-3 z-10 "
        }
      >
        <ShareButton id={data.id} />
      </div>
      
      <div
        onClick={() => navigate(`/listing/${data.short_id}`)}
        className={"w-full flex flex-row py-1 px-2 justify-between"}
      >
        <div className={"w-4/5 flex flex-col gap-1 items-start"}>
          <IonLabel className={"line-clamp-1 overflow-hidden"}>
            {data.origin||(data?.places && data?.places[0])}
          </IonLabel>
          <IonLabel className={""}>{data.title}</IonLabel>
  
          <IonLabel className={" font-sans text-2xl "}>
            {data?.cost.toFixed(2) !} <span className={'text-lg'}>{t('OMR')}</span>
          </IonLabel>
         
        </div>
        <div className={"w-auto h-full flex gap-1 items-start justify-start "}>
          {" "}
          <BiStar /> {rating}/5
        </div>
      </div>
    </div>
  );
}



const ErrorCard = () => {
  return (
    <IonCard
      className={
        "flex items-center justify-center w-full md:w-[50%] lg:w-[30%] max-w-[412px]"
      }
    >
      <BiErrorCircle size="2rem" />
      Ops.
    </IonCard>
  );
};

function ShareButton({ id, ...props }) {
  return (
    <button
      className={
        "flex items-center justify-center bg-blend-overlay backdrop-blur-lg rounded-full  text-white p-1  active:scale-75 transition-all hover:text-blue-500 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/20  to-transparent"
      }
      {...props}
      onClick={async function () {
        let can = await Share.canShare();
        can.value &&
          Share.share({
            text: `Find Your Next Amazing Travel Places Here

              check here ${getPathTo(`listing/${id}`)}
              `,
            url: getPathTo(`listing/${id}`),
          });
      }}
    >
      <BiShare className={""} size={"1.5rem"} />
    </button>
  );
}
