interface UploadImageServiceArgs {
  fileBuffer: Buffer;
  folder: string;
}

export type UploadImageService = (
  args: UploadImageServiceArgs,
) => Promise<string>;
