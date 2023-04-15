const cheerio = require("cheerio");
const axios = require("axios");
const fs = require("fs");
const teams = [
  "Arizona-Cardinals",
  "Atlanta-Falcons",
  "Baltimore-Ravens",
  "Buffalo-Bills",
  "Carolina-Panthers",
  "Chicago-Bears",
  "Cincinnati-Bengals",
  "Cleveland-Browns",
  "Dallas-Cowboys",
  "Denver-Broncos",
  "Detroit-Lions",
  "Green-Bay-Packers",
  "Houston-Texans",
  "Indianapolis-Colts",
  "Jacksonville-Jaguars",
  "Kansas-City-Chiefs",
  "Los-Angeles-Chargers",
  "Los-Angeles-Rams",
  "Miami-Dolphins",
  "Minnesota-Vikings",
  "New-England-Patriots",
  "New-Orleans-Saints",
  "New-York-Giants",
  "New-York-Jets",
  "Las-Vegas-Raiders",
  "Philadelphia-Eagles",
  "Pittsburgh-Steelers",
  "San-Francisco-49ers",
  "Seattle-Seahawks",
  "Tampa-Bay-Buccaneers",
  "Tennessee-Titans",
  "Washington-Redskins",
];
console.log("teams.length", teams.length);
console.log("teams", teams[23]);
let allData = {};
const scrape = async (team, yearFrom, yearTo) => {
  let axiosResponse = {};
  try {
    axiosResponse = await axios.request({
      method: "GET",
      url: `https://templatetrove.com/Printable-${yearFrom}-${yearTo}-${team}-Schedule.htm`,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
      },
    });
  } catch (error) {
    axiosResponse.status = 404;
  }

  if (axiosResponse.status !== 200) {
    return [];
  }
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
        obj["image"] = baseURL + "/" + image;
      } else if (image?.split(".")[1] === "pdf") {
        if (!obj["pdf"]) {
          obj["pdf"] = baseURL + "/" + image;
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

const scrapeAll = async (from, to) => {
  for (let i = 0; i < teams.length; i++) {
    const data = await scrape(teams[i], from, to);
    allData[teams[i]] = data;
    console.log(i + " 🔥🔥🔥🔥🔥 " + teams[i] + "DONE");
    // console.log(data);
    // console.log(i + " 🔥🔥🔥🔥🔥 " + teams[i]);
  }
  fs.writeFileSync(
    `../src/schedules/${from + "-" + to}.json`,
    JSON.stringify(allData)
  );
  console.log("DONE", from + "-" + to);
  // console.log("allData", allData);
};

const getAllYearsData = async () => {
  const date = new Date().getFullYear();
  // console.log(date.getFullYear());
  for (let i = 2020; i < date + 1 ; i++) {
    await scrapeAll(i, i + 1);
  }
};
getAllYearsData();
//  scrapeAll(2023, 2024);

// scrapeAll();
