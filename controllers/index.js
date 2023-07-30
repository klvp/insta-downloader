/** @format */

import fs from "fs";
import ytdl from "ytdl-core";

async function downloadYTVideo(req, res) {
  try {
    let url = "https://www.youtube.com/watch?v=yLxapIHNSfc";
    let videoID = ytdl.getVideoID(url);
    let info = await ytdl.getInfo(videoID);
    console.log(
      "Downloading",
      info.formats.map((i) => i.itag)
    );
    await new Promise((resolve, reject) => {
      try {
        // let format = ytdl.chooseFormat(info.formats, { quality: "136" });
        // ytdl.chooseFormat(format, "videoandaudio");
        // ytdl(url).pipe(fs.createWriteStream(`${info.videoDetails.title}.mp4`));
        ytdl
          .downloadFromInfo(info, {
            filter: "videoandaudio",
            quality: 136,
          })
          .pipe(fs.createWriteStream(`${info.videoDetails.title}.mp4`));
        // console.log(ytdl.chooseFormat(format, "videoandaudio"));
        resolve();
      } catch (error) {
        reject(error);
      }
    });
    console.log("Downloading finished");
    // let format = ytdl.chooseFormat(info.formats, { quality: "136" });
    // console.log(ytdl.videoFormat);
  } catch (error) {
    console.log(error);
  }
}
downloadYTVideo();
