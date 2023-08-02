/** @format */

import fs from "fs";
import readline from "readline";
import ytdl from "ytdl-core";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function downloadYTVideo() {
  try {
    const videoURL = "https://www.youtube.com/watch?v=yLxapIHNSfc";
    const info = await ytdl.getInfo(videoURL);

    // Filter out audio and video formats
    const formatsWithAudio = ytdl.filterFormats(info.formats, "audioandvideo");
    console.log("Available formats:");

    // Display available formats to the user
    formatsWithAudio.forEach((format, index) => {
      console.log(
        `${index}. ${format.itag} - ${format.container} - ${format.qualityLabel}`
      );
    });

    rl.question("Enter the index of the preferred format: ", (index) => {
      const selectedFormat = formatsWithAudio[index];

      if (!selectedFormat) {
        console.log("Invalid selection");
        rl.close();
        return;
      }

      const videoStream = ytdl(videoURL, { format: selectedFormat });
      const writeStream = fs.createWriteStream(
        `${info.videoDetails.title}.${selectedFormat.container}`
      );

      videoStream.pipe(writeStream);

      videoStream.on("progress", (chunkLength, downloaded, total) => {
        const percent = downloaded / total;
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0, null);
        process.stdout.write(`Downloaded: ${(percent * 100).toFixed(2)}%`);
      });

      videoStream.on("end", () => {
        console.log("\nDownload completed");
        rl.close();
      });

      videoStream.on("error", (error) => {
        console.error("Error occurred during download:", error);
        rl.close();
      });
    });
  } catch (error) {
    console.error("Error occurred:", error);
  }
}

downloadYTVideo();
