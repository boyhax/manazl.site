import { Photo } from "@capacitor/camera";
import supabase, { get_path_from_url } from "../supabase";
import { b64toBlob } from "../utils/blob";

export const getStoragePathFromUrl = (url) => {
  const path = get_path_from_url(url).split("/").slice(6).join("/");
  return path;
};

export const deletefile = async (path: string, bucket: string) => {
  const res = await supabase.storage.from(bucket).remove([path]);
  console.log("deletefile path,res.error :>> ", path, res.error);
  return res;
};

// export const uploadPhoto = async (photo: Photo, bucket: string, path = "") => {
//   if (!photo.base64String)
//     return { url: null, error: { message: "photo dont have data" } };
//   const file = b64toBlob(photo.base64String!, "image/png", 1000);
//   const newpath = path ? path : `${new Date().toISOString()}.${photo.format}`;

//   try {
//     return await uploadfile(bucket, file, newpath, `image/${photo.format}`);
//   } catch (error) {
//     console.trace(error);
//     return { url: null, error: { message: "upload of image failed" } };
//   }
// };

export const uploadfile = async (
  bucket: string,
  File: string|Blob|File,
  path: string,
  contentType: string
) => {
  try {
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
