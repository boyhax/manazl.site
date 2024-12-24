import { Camera, CameraResultType } from "@capacitor/camera";
import {  uploadfile } from "src/lib/db/storage";

import { useIonToast } from "@ionic/react";
import { useTranslate } from "@tolgee/react";
import { useState } from "react";
import { auth } from "../state/auth";
import supabase from "src/lib/supabase";
import { updateUser } from "src/lib/db/profile";
import { b64toBlob } from "src/lib/utils/blob";

const useProfile = () => {
  const [loading, setloading] = useState(false);
  const [toast] = useIonToast();
  const { t } = useTranslate();
  const { user } = auth();
  const updateAvatar = async () => {
    const photo = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      webUseInput: true,
      height: 200,
      width: 200,
      correctOrientation: true,
      presentationStyle: "popover",
    });
    if (!photo || !photo.base64String) {
      toast("image select closed", 1000);
    }
    setloading(true);

    const { url, error } = await uploadfile("images",b64toBlob( photo.base64String!, "image/png", 1000),(user.id+  `/avatar/avatar.png`), "image/"+photo.format);
    if (!error) {
      const { error, data } = await updateUser({
        avatar_url: url + "?time="+new Date().toISOString(),
      });
      if (!error) {
        toast("avatar updated", 1000);
      } else {
        toast(t("sorry some problem happen!"), 1000);
      }
    } else {
      console.trace(error);
      toast("avatar update failed", 1000);
    }
    setloading(false);
  };
  async function updateProfile(data) {
    setloading(true);
    const { error } = await updateUser({ ...data });
    if (!error) {
      toast("profile updated", 1000);
    } else {
      toast("profile update error " + error.message, 1000);
    }
    setloading(false);
  }
  return {  updateAvatar, loading,updateProfile };
};
export default useProfile;
