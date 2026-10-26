import { v2 as cloudinary } from "cloudinary";

export function getCloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (cloudName && apiKey && apiSecret) {
    return {
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    };
  }

  const cloudinaryUrl = process.env.CLOUDINARY_URL;
  if (!cloudinaryUrl) {
    return null;
  }

  try {
    const url = new URL(cloudinaryUrl);
    const cloudNameFromUrl = url.hostname;
    const apiKeyFromUrl = url.username;
    const apiSecretFromUrl = url.password;

    if (!cloudNameFromUrl || !apiKeyFromUrl || !apiSecretFromUrl) {
      return null;
    }

    return {
      cloud_name: cloudNameFromUrl,
      api_key: apiKeyFromUrl,
      api_secret: apiSecretFromUrl,
    };
  } catch {
    return null;
  }
}

export function isCloudinaryConfigured() {
  return Boolean(getCloudinaryConfig());
}

function getCloudinary() {
  const config = getCloudinaryConfig();

  if (!config) {
    throw new Error("Cloudinary is not configured.");
  }

  cloudinary.config({
    ...config,
    secure: true,
  });

  return cloudinary;
}

export type CloudinaryUploadResult = {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
};

export async function uploadImage(
  buffer: Buffer,
  filename: string,
  folder = "alpha-fellowship"
): Promise<CloudinaryUploadResult> {
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary is not configured.");
  }

  const client = getCloudinary();

  const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
    client.uploader
      .upload_stream(
        {
          folder,
          public_id: filename.replace(/\.[^.]+$/, ""),
          resource_type: "image",
        },
        (error, uploadResult) => {
          if (error || !uploadResult) {
            reject(error ?? new Error("Upload failed"));
            return;
          }

          resolve({
            url: uploadResult.secure_url,
            publicId: uploadResult.public_id,
            width: uploadResult.width,
            height: uploadResult.height,
            format: uploadResult.format,
            bytes: uploadResult.bytes,
          });
        }
      )
      .end(buffer);
  });

  return result;
}
