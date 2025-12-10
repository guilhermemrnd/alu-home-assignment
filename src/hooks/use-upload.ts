import { useMutation } from "@tanstack/react-query";

import { httpClient, UploadResponse } from "@/lib/http-client";

export function useUpload() {
  return useMutation<UploadResponse, Error, File>({
    mutationFn: httpClient.uploadFile,
  });
}