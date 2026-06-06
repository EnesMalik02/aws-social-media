import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getUploadUrl, uploadToS3, createPost, postKeys } from "@entities/post";

export function useCreatePostMutation(userId: string | undefined) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ file, caption }: { file: File; caption: string }) => {
      const { upload_url, image_url } = await getUploadUrl(file.name, file.type);
      await uploadToS3(upload_url, file);
      return createPost(caption, image_url);
    },
    onSuccess: () => {
      if (userId) qc.invalidateQueries({ queryKey: postKeys.byUser(userId) });
    },
  });
}
