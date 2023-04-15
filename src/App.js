import axios from "axios";
import { useEffect } from "react";
import { scrape } from "../server/server";
// import cheerio from "cheerio"

const cheerio = require("cheerio");
function App() {
  useEffect(() => {
    scrape("Baltimore-Ravens", 2019, 2020).then((data) => {
      console.log(data);
    });
  }, []);
  return <div className="App"></div>;
}

export default App;
