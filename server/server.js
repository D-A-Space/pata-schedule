const cheerio = require("cheerio");
const axios = require("axios");

const scrape = async (team, yearFrom, yearTo) => {
  const axiosResponse = await axios.request({
    method: "GET",
    url: `https://templatetrove.com/Printable-${yearFrom}-${yearTo}-${team}-Schedule.htm`,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
    },
  });
  const baseURL = "https://templatetrove.com";
  const $ = cheerio.load(axiosResponse.data);
  const data = [];
  let obj = {};
  // contentLeft
  $(".contentLeft")
    .find(".center")
    .each((i, el) => {
      const image = $(el).find("a")?.attr("href");
      if (image?.split(".")[1] === "png") {
        obj["image"] = baseURL + image;
      } else if (image?.split(".")[1] === "pdf") {
        if (!obj["pdf"]) {
          obj["pdf"] = baseURL + image;
        }
      } else {
        if (Object.keys(obj).length > 0) {
          data.push(obj);
        }
        obj = {};
      }
    });

  return data;
};
export { scrape };
