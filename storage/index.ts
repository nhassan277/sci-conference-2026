import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "auto",
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
  },
});

export async function storagePut(
  key: string,
  data: Buffer | Uint8Array | string,
  contentType?: string
): Promise<{ key: string; url: string }> {
  const bucket = process.env.S3_BUCKET || "";
  const publicUrl = process.env.S3_PUBLIC_URL || "";
  
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: data,
    ContentType: contentType,
  });

  await s3Client.send(command);

  const url = `${publicUrl}/${key}`;
  return { key, url };
}
