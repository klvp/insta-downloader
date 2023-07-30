/** @format */

import fs from "fs";
import ytdl from "ytdl-core";

async function downloadYTVideo() {
  try {
    const videoURL = "https://www.youtube.com/watch?v=yLxapIHNSfc";
    const info = await ytdl.getInfo(videoURL);
    const videoFormat = ytdl.chooseFormat(info.formats, { quality: "highest" });

    const videoStream = ytdl(videoURL, { format: videoFormat });
    const writeStream = fs.createWriteStream("video.mp4");

    videoStream.pipe(writeStream);

    videoStream.on("progress", (chunkLength, downloaded, total) => {
      const percent = downloaded / total;
      console.log(`Downloaded: ${(percent * 100).toFixed(2)}%`);
    });

    videoStream.on("end", () => {
      console.log("Download completed");
    });

    videoStream.on("error", (error) => {
      console.error("Error occurred during download:", error);
    });
  } catch (error) {
    console.error("Error occurred:", error);
  }
}

downloadYTVideo();
