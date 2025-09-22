import {
  Camera,
  CameraResultType,
  CameraSource,
  ImageOptions,
  Photo,
} from "@capacitor/camera";
import { useState } from "react";
import useMounted from "./useMounted";

interface useImagePikerProps {
  options?: ImageOptions;
  def?: Photo;
}

const useImagePicker = (options?: ImageOptions, def?: Photo) => {
  const { mounted } = useMounted();
  const [image, setimage] = useState(def);
  const pickImage = async () => {
    const image = await Camera.getPhoto(
      options || {
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Photos,
      }
    );

    if (mounted && !image) {
      setimage(image);
      return image
    }
  };

  return { image, pickImage };
};

export default useImagePicker;
