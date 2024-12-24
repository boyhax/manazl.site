import React, { useEffect, useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Camera, GalleryPhotos } from "@capacitor/camera";
import { Filesystem } from "@capacitor/filesystem";
import { IonSpinner } from "@ionic/react";
import { Trash2, Upload, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import supabase from "src/lib/supabase";
import { auth } from "src/state/auth";
import { deletefile, uploadfile } from "src/lib/db/storage";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { isPlatform } from "@ionic/react";
import { ScrollArea } from "./ui/scroll-area";
import { useTranslate } from "@tolgee/react";
import { b64toBlob } from "src/lib/utils/blob";

interface GallaryProps {
  onChange?: (v: string[]) => void;
  selected?: string[];
  path: string;
}

export default function ({ onChange, selected, path }: GallaryProps) {
  const { t } = useTranslate();
  const {
    images,
    loading,
    error,
    addFiles,
    addPhotos,
    handleDelete,
    uploadingNow,
  } = useGallery({ path });
  let currentlength = images ? images.length : 0;

  const onDrop = useCallback(
    (acceptedFiles) => {
      console.log("acceptedFiles :>> ", acceptedFiles);
      addFiles(acceptedFiles);
    },
    [addFiles]
  );

  useEffect(() => {
    onChange && onChange(images);
  }, [images]);

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    multiple: true,
    maxFiles: 10 - currentlength,
    accept: { "image/*": [] },
  });

  async function _handleAdd() {
    if (isPlatform("hybrid")) {
      const files = await Camera.pickImages({
        limit: 10 - currentlength,
        quality: 100,
      });
      addPhotos(files);
      console.log("files from native:>> ", files);
    } else {
      console.log("files from browser:>> ");
      open();
    }
  }
  return (
    <div className="w-full max-w-3xl mx-auto">
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <IonSpinner />
          </div>
        ) : (
          <ScrollArea className="h-72 mt-4 rounded-md border">
            <div className="p-4 grid grid-cols-2 gap-4" {...getRootProps()}>
              <input {...getInputProps()} />
              <AnimatePresence>
                {uploadingNow > 0 &&
                  Array.from({ length: uploadingNow }).map((_, i) => (
                    <motion.div
                      key={`uploading-${i}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center"
                    >
                      <IonSpinner />
                    </motion.div>
                  ))}
                {images &&
                  images.map((path) => (
                    <motion.div
                      key={path}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="relative group aspect-square"
                    >
                      <img
                        src={publicPath(path)}
                        alt={path}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(path);
                          }}
                          className="text-white"
                        >
                          <Trash2 size={20} />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
              </AnimatePresence>
              {images && images.length === 0 && !uploadingNow && (
                <div className="col-span-full flex flex-col items-center justify-center text-gray-500 p-8">
                  <ImageIcon size={48} className="mb-2" />
                  <p>{t("Drag & drop images here, or click to select")}</p>
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          onClick={() => _handleAdd()}
          disabled={loading || uploadingNow > 0}
        >
          <Upload className="mr-2" size={20} />
          {t("Add Images")}
        </Button>
        {error && <p className="text-red-500">{error.message}</p>}
      </CardFooter>
    </div>
  );
}

function publicPath(path: string, width?: number, height?: number) {
  return supabase.storage.from("images").getPublicUrl(path, {
    transform: { width: width || 200, height: height || 200 },
  }).data.publicUrl;
}

const readFilePath = async (path: string) => {
  const contents = await Filesystem.readFile({ path });
  return contents;
};

function useGallery({ path }: { path: string }) {
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadingNow, setUploadingNow] = useState(0);

  async function fetch() {
    setLoading(true);
    const { data, error } = await supabase.storage
      .from("images")
      .list(path, {});
    console.log("fetch data :>> ", data);
    setLoading(false);
    if (data) {
      let paths = data
        .filter((file) => isImagePath(file.name))
        .map((o) => path + "/" + o.name);
      setImages(paths);
    } else if (error) {
      setError(error);
    }
  }

  useEffect(() => {
    fetch();
  }, [path]);

  async function handleDelete(path: string) {
    const { error } = await deletefile(path, "images");
    if (!error) {
      setImages(images.filter((img) => img != path));
    }
  }
  async function addPhotos(files: GalleryPhotos) {
    setUploadingNow(files.photos.length);

    try {
      const uploadResults = await Promise.all(
        files.photos.map(async (file, i) => {
          let content = await readFilePath(file.path);
          const filepath = path + `/${new Date().toISOString()+String(i)}.${file.format}`;
          let base64 = `data:image/${file.format};base64,${content.data}`;
          let blob = b64toBlob(base64);
          return await uploadfile(
            "images",
            blob,
            filepath,
            "image/" + file.format
          );
        })
      );
      let newPaths = uploadResults.map((res) => res.path);
      // setImages(images);
      fetch();
    } catch (error) {
      console.log("Error from image uploads:", error);
      setError(error);
    } finally {
      setUploadingNow(0);
    }
  }
  async function addFiles(files: File[]) {
    setUploadingNow(files.length);

    try {
      const uploadResults = await Promise.all(
        files.map((file,i) => {
          const format = file.type.split("/")[1];
          const filepath = path + `/${new Date().toISOString()+String(i)}.${format}`;
          return uploadfile("images", file, filepath, "image/" + format);
        })
      );
      let pathes = uploadResults.map((res) => res.path);
      let errors = uploadResults.map((res) => res.error);
      console.log("newPaths errors:>> ", pathes, errors);
      // setImages(images.concat(pathes));
      fetch();
    } catch (error) {
      console.log("Error from image uploads:", error);
      setError(error);
    } finally {
      setUploadingNow(0);
    }
  }

  return {
    images,
    loading,
    error,
    addFiles,
    handleDelete,
    addPhotos,
    uploadingNow,
  };
}

function isImagePath(path: string): boolean {
  const imageExtensions = /\.(jpg|jpeg|png|gif|bmp|webp|tiff)$/i;
  return imageExtensions.test(path);
}
