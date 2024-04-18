import { google } from "googleapis";
import { env } from "$env/dynamic/private";
import * as mammoth from "mammoth";

const credentials = JSON.parse(env.GOOGLE_CREDENTIALS);
const scopes = ["https://www.googleapis.com/auth/drive.readonly"];

const auth = new google.auth.GoogleAuth({
  credentials: credentials,
  scopes: scopes,
});

const drive = google.drive({
  version: "v3",
  auth: auth,
});

const cache = {} as Record<string, string>;

export async function getFileContents(fileId: string) {
  if (cache[fileId]) {
    return cache[fileId];
  }

  const txtfile = drive.files.export({
    fileId: fileId,
    alt: "media",
    mimeType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });

  const file: any = await txtfile.finally();

  const extract = mammoth
    .extractRawText({ buffer: file.data.arrayBuffer() })
    .then(function (result) {
      var text = result.value;
      return text;
    });

  const text = await extract;

  cache[fileId] = text;

  setTimeout(() => {
    delete cache[fileId];
  }, 10 * 60 * 1000);

  return text;
}
export default getFileContents;
