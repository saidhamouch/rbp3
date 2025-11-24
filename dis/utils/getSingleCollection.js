const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "../displates.json"); // Replace with the path to your JSON file

const getSingleCollection = async (collectionLink) => {
  // Read the JSON file
  const data = fs.readFileSync(filePath, "utf-8");
  const jsonData = JSON.parse(data);
  const foundElement = jsonData.find(
    (element) => element.link === collectionLink
  );
  return foundElement;
};

module.exports = getSingleCollection;
