const file = "displates.json";
const data = require("../dis/" + file);
const fs = require("fs");

newPosters = [];
posters = data.map((x) => {
  newPosters = newPosters.concat(x.posters);
});
links = newPosters.map((x) => x.posterLink);

fs.writeFile(
  "single-links.json",
  JSON.stringify(links, null, 2),
  function (err) {
    console.log(err);
  }
);
