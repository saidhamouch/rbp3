const fs = require("fs");
const path = require("path");

const getSingleCollection = async (collectionLink, file) => {
  const filePath = path.join(__dirname, file); // Replace with the path to your JSON file

  // Read the JSON file
  const data = fs.readFileSync(filePath, "utf-8");
  const jsonData = JSON.parse(data);
  const foundElement = jsonData.find(
    (element) => element.link === collectionLink
  );
  return foundElement;
};

module.exports = getSingleCollection;
