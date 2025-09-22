import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from "@capacitor/camera";
import { IonIcon, IonImg, IonThumbnail } from "@ionic/react";
import { addSharp, closeOutline } from "ionicons/icons";
import React, { FunctionComponent } from "react";

interface MultiImagePickerProps {
  count?: number;
  items: (Photo | string)[];
  onAdd: (photo: Photo) => void;
  onRemove: (index: number) => void;
  onReplace: (oldindex: number, photo: Photo) => void;
}

const MultiImagePicker: FunctionComponent<MultiImagePickerProps> = ({
  count,
  onAdd,
  onRemove,
  items,
  onReplace,
}) => {
  const hundleClick = (index: number | null) =>
    Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos,
      promptLabelHeader: "Select Image",
    }).then((photo) => {
      if (!photo) return;
      if (index != null) {
        onReplace && onReplace(index, photo);
      } else {
        onAdd && onAdd(photo);
      }
    });

  return (
    <div className={"p-2 flex flex-wrap items-center justify-center gap-3"}>
      {items.map((img, index: number) => {
        return (
          img && (
            <div
              key={index}
              className={`  block outline-1 w-20 h-20 outline-dashed outline-gray-400 rounded-xl   overflow-hidden ${index === 0 ? "border-4 border-double" : ""}`}
            >
              <IonIcon
                onClick={() => onRemove(index)}
                className={" bg-slate-400 text-white  absolute rounded-full "}
                icon={closeOutline}
              ></IonIcon>
              <IonImg
                onClick={() => hundleClick(index)}
                alt={"dd"}
                className={`object-cover w-full h-full `}
                src={
                  typeof img === "string"
                    ? img
                    : `data:image/jpeg;base64,${img.base64String!}`
                }
              ></IonImg>
            </div>
          )
        );
      })}
      {items.length < (count || 5) && (
        <IonThumbnail
          className={`${items.length === 0 ? "border-4 border-double":''}   outline-1 w-20 h-20 outline-dashed outline-gray-400 rounded-xl flex items-center justify-center  overflow-hidden`}
          onClick={() => hundleClick(null)}
        >
          <IonIcon icon={addSharp} />
        </IonThumbnail>
      )}
    </div>
  );
};

export default MultiImagePicker;
