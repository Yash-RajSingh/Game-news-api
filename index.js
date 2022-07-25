const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");
const baseUrl = `https://gamerant.com/gaming/`;
const PORT = process.env.PORT || 8000;
const app = express();

app.use(cors());
app.get("/", (req, res) => {
  res.send("Its time to read some game news!");
});

app.get("/gameNews", (req, res) => {
  axios
    .get(baseUrl)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const GameNews = [];
      $(".browse-clip").each(function (index, element) {
        const title = $(element)
          .find(".bc-title > .bc-title-link")
          .text()
          .trimStart()
          .trimEnd();
        const sourceLink = $(element)
          .find(".bc-title > .bc-title-link")
          .attr("href");
        const description = $(element)
          .find(".bc-excerpt")
          .text()
          .trimStart()
          .trimEnd();
        const thumbnail = $(element).find("source").attr("data-srcset");
        const time = $(element).find("time").text().trimStart().trimEnd();
        const author = $(element)
          .find("a.bc-author")
          .text()
          .trimStart()
          .trimEnd();
        const authorProfile = $(element).find("a.bc-author").attr("href");
        if (
          title &&
          sourceLink &&
          description &&
          thumbnail &&
          time &&
          author &&
          authorProfile
        ) {
          GameNews.push({
            title,
            sourceLink,
            description,
            thumbnail,
            time,
            author,
            authorProfile,
          });
        }
      });
      res.send(GameNews);
    })
    .catch((err) => console.log(err));
});

app.listen(PORT, () => console.log(`Server running on PORT : ${PORT}`));
