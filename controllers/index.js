/** @format */

import fs from "fs";
import ytdl from "ytdl-core";

// URL of the video to be downloaded
const url = "https://www.youtube.com/watch?v=yLxapIHNSfc";

let videoSize = 0;
let downloaded = 0;

ytdl.getInfo(url, (err, info) => {
  if (err) throw err;

  // Get video details
  const formats = ytdl.filterFormats(info.formats, "mp4");

  // Choose the highest quality format
  const format = formats[0];

  // Create a readable stream
  const stream = ytdl.downloadFromInfo(info, { format: format });

  stream.on("response", (res) => {
    videoSize = res.headers["content-length"];
  });

  stream.on("data", (chunk) => {
    downloaded += chunk.length;
    const downloadedMinutes = (downloaded / videoSize) * 100;
    process.stdout.write(`Progress: ${downloadedMinutes.toFixed(2)}%\r`);
  });

  stream.pipe(fs.createWriteStream("video.mp4"));
});
