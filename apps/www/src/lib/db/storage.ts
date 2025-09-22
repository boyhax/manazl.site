"use server";

import { createClient } from "@/app/lib/supabase/server";

export const getStoragePathFromUrl = async (url: string) => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const o = supabase.storage.from("").getPublicUrl(url).data.publicUrl;
  const path = url.replace(o, "");
  return path;
};

export const deletefile = async (path: string, bucket: string) => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const res = await supabase.storage.from(bucket).remove([path]);
  console.log("deletefile path,res.error :>> ", path, res.error);
  return res;
};

export const uploadfile = async (
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
