import {
  IonCard,
  IonIcon,
  IonLabel,
  IonSkeletonText
} from "@ionic/react";
import { arrowForwardSharp } from "ionicons/icons";
import { useNavigate } from "react-router-dom";
import Img from "src/components/Image";
import ExploreLine from "./exploreLine";
import { useTranslate } from "@tolgee/react";

const ExploreListings = ({
  items,
  title,
  onMore,
  loading,
}: {
  items: any[];
  title: string;
  onMore: () => void;
  loading: boolean;
}) => {
  if (!items) return null;
  const navigate = useNavigate();
  return (
    <div className={"mt-4"}>
      <IonLabel className={"text-xl capitalize inset-3 ms-4"}>
        {title}{" "}
      </IonLabel>
      <span>
        <IonIcon onClick={onMore} icon={arrowForwardSharp} />
      </span>
      <ExploreLine
        placeholder={title}
        space={3}
        slides={1.5}
        items={
          loading
            ? [placholder, placholder]
            : items?.map((value) => (
                <div
                  onClick={() => navigate("/listing/" + value.id)}
                  className={
                    "flex flex-col w-full items-center h-[125px]  mt-2  rounded-lg overflow-hidden"
                  }
                >
                  <Img
                    className={"object-cover  overflow-hidden  w-full h-full "}
                    src={value.thumbnail}
                  />
                  <div
                    className={
                      "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent flex items-center justify-start w-full"
                    }
                  >
                    <IonLabel
                      className={
                        " inset-4 ms-3  text-lg font-sans text-white  text-start capitalize truncate pb-3 "
                      }
                    >
                      {value.title}
                    </IonLabel>
                  </div>
                </div>
              ))
        }
      />
    </div>
  );
};

export default ExploreListings;

const placholder = (
  <div className={"flex flex-col items-center"}>
    <IonCard
      className={
        "shadow-none md:shadow-md h-[125px]  w-[250px] max-w-md rounded-2xl "
      }
    >
      <IonSkeletonText
        className={"object-cover  overflow-hidden  w-full h-full "}
      />
    </IonCard>
    <div className={"flex items-center justify-start w-full"}>
      <IonLabel
        className={" inset-4 ms-3   font-sans   text-start capitalize "}
      >
        <IonSkeletonText />
      </IonLabel>
    </div>
  </div>
);

export const SmallPreview = ({ value, featured, newAdd ,near}: any) => {
  const navigate = useNavigate();
  const {t} = useTranslate()

  return (
    <div
      onClick={() => navigate("/listing/" + value.id)}
      className={
        "flex flex-col w-full items-center h-[125px]  mt-2  rounded-lg overflow-hidden relative"
      }
    >
      <Img
        className={"object-cover  overflow-hidden  w-full h-full "}
        src={value.thumbnail}
      />
      {(featured ||
        newAdd ||near) && (
          <div
            className={
              "absolute top-0 left-0 rounded-br-lg bg-blue-900 p-1 "
            }
          >
            {featured && t("Featured")}
            {newAdd && t("New")}
            {near && t("Near You")}
          </div>
        )}
      <div
        className={
          "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent flex items-center justify-start w-full"
        }
      >
        <IonLabel
          className={
            " inset-4 ms-3  text-lg font-sans text-white  text-start capitalize truncate pb-3 "
          }
        >
          {value.title}
        </IonLabel>
      </div>
    </div>
  );
};
