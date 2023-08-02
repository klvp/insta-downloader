/** @format */

import axios from "axios";
import { parse } from "node-html-parser";
import fs from "fs";

const instagramPostLink = "https://www.instagram.com/p/CsZNWaxJayF/";

async function getPostLink(url) {
  url = url + "embed" + "/captioned";
  let res = axios.get(url).then(async (response) => {
    const root = parse(response.data);
    let link = "";
    if (response.data.search("video_url") != -1)
      link = getVideoLinkFromHtml(response.data);
    else
      link = root.querySelector("img.EmbeddedMediaImage").getAttribute("src");

    while (link.search("&amp;") != -1) {
      link = link.replace("&amp;", "&");
    }
    let caption = await getCaptionFromHtml(response.data);
    return { link, caption };
  });
  return res;
}

async function getCaptionFromHtml(html) {
  const root = parse(html);
  let caption = root.querySelector(".Caption")?.text;
  if (caption == undefined) caption = "No caption";
  caption = caption.replace("view all comments", "");
  return caption;
}

function getVideoLinkFromHtml(html) {
  // console.log(html);
  // fs.writeFileSync("instaIndex.html", JSON.stringify(html));
  let crop =
    '{"' +
    html.substring(html.search("video_url"), html.search("video_url") + 1000);
  // console.log(
  //   JSON.stringify(
  //     html
  //       .substring(html.search("video_url"), html.search("video_url") + 1000)
  //       .substring(0, crop.search(","))
  //   )
  // );
  crop = crop.substring(0, crop.search(",")) + "}";
  return JSON.parse(crop).video_url;
}

// function getVideoLinkFromHtml(html) {
//   const regex = /\"video_url\":\"([^"]+)/;
//   const match = html.match(regex);

//   if (match && match[1]) {
//     return match[1];
//   } else {
//     throw new Error("video_url not found in HTML");
//   }
// }

(async () => {
  console.log(await getPostLink(instagramPostLink));
})();
