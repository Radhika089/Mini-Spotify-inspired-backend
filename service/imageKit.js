import dotenv, { config } from "dotenv";
dotenv.config();

import ImageKit from "@imagekit/nodejs";

const client = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

export async function uploadFile(buffer, fileName) {
  const result = await client.files.upload({
    file: buffer,
    fileName,
  });

  return result;
}
