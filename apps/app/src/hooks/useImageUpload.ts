import { useMutation } from '@tanstack/react-query'
import supabase from 'src/lib/supabase'
import { compressBase64Image } from 'src/lib/utils/blob'
import { TFile } from 'src/lib/utils/imagePicker'

export async function uploadfiles(files: TFile[], options: { path: string }) {
  const promises = files.map(async (file) => {
    const filePath = `${options.path}/${Date.now() }`
    const _file =
      file.blob || (await compressBase64Image(file.data, 3, file.mimeType))

    return supabase.storage
      .from('images')
      .upload(filePath, _file, { upsert: true })
      .then((res) => {
        if (res.error) {
          throw new Error(res.error.message)
        }
        return supabase.storage.from('images').getPublicUrl(res.data.path).data
          .publicUrl
      })
  })

  return await Promise.all(promises)
}
export function useImageUpload(userId: string, path: string = 'default') {
  const uploadMutation = useMutation({
    mutationKey: ['upload', userId, path],
    mutationFn: async(files: TFile[]) => await uploadfiles(files, { path: `${userId}/${path}` }),
  })

  return {
    uploadFiles: uploadMutation.mutate,
    uploadFilesMutation: uploadMutation,
    isUploading: uploadMutation.isPending,
    uploadError: uploadMutation.error,
    uploadedUrls: uploadMutation.data || [],
  }
}
