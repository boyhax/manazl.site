'use client'
import { useTranslate } from "@tolgee/react";
import { useState } from "react";
import { updateUser } from "src/lib/db/profile";
import { useToast } from "./use-toast";
import { createClient } from "@/app/lib/supabase/client";
import { useUserContext } from "@/providers/userProvider";

const uploadfile = async (
  bucket: string,
  File: string | Blob | File,
  path: string,
  contentType: string
) => {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { error, data } = await supabase.storage
      .from(bucket)
      .upload(path, File, {
        cacheControl: "3600",
        upsert: true,
        contentType,
      });
    if (error) {
      console.trace("error :>> ", error);
      return { url: null, error: { message: "failed at upload" }, path: null };
    }
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(data.path);
    return { url: publicUrl, error: null, path: path as string };
  } catch (error) {
    console.trace(error);
    return { url: null, error: { message: "failed at upload" }, path: null };
  }
};
const useProfile = () => {
  const [loading, setloading] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslate();

  const updateAvatar = async (file: any) => {
    if (!file) {
      toast({ title: "No image selected", duration: 1000 });
      return;
    }
    const client = createClient()
    const { data: { user } } = await client.auth.getUser()

    if (!user) {
      toast({ title: "user_not_found", duration: 1000 });
      return;
    }
    setloading(true);

    try {
      const { url, error } = await uploadfile(
        "images",
        file,
        `${user.id}/avatar/avatar.png`,
        file.type
      );

      if (error) throw error;

      const { error: updateError } = await updateUser({
        avatar_url: url + "?time=" + new Date().toISOString(),
      });

      if (updateError) throw updateError;

      toast({ title: "Avatar updated", duration: 1000 });
    } catch (error) {
      console.error(error);
      toast({ title: t("Sorry, a problem occurred!"), duration: 1000 });
    } finally {
      setloading(false);
    }
  };

  async function updateProfile(data: any) {
    setloading(true);
    const { error } = await updateUser({ ...data });
    if (!error) {
      toast({ title: "profile updated", duration: 1000 });
    } else {
      toast({ title: "profile update error " + error.message, duration: 1000 });
    }
    setloading(false);
  }
  return { updateAvatar, loading, updateProfile };
};
export default useProfile;
