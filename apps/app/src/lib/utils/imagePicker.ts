import { FilePicker, PickedFile } from '@capawesome/capacitor-file-picker';
import { Capacitor } from '@capacitor/core';
import { isPlatform } from '@ionic/react';

export type TFile = PickedFile;

export const checkPermissions = async () => {
  return FilePicker.checkPermissions();
};

export const requestPermissions = async () => {
  return FilePicker.requestPermissions();
};

export async function pickImages(): Promise<TFile[]> {
  const { files } = await FilePicker.pickImages({
    readData: isPlatform("hybrid"),
  });
  
  return files.map((file) => ({
    ...file,
    path: getPreviewPath(file),
  }))
}
function getPreviewPath(photo: TFile) {
  if (Capacitor.isNativePlatform()) {
    return Capacitor.convertFileSrc(photo.path)
  } else {
    return URL.createObjectURL(photo.blob)
  }
}