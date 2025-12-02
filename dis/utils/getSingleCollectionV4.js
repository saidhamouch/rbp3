const fs = require("fs");

const getSingleCollection = async (collectionLink, filePath) => {
  // Read the JSON file
  const data = fs.readFileSync(filePath, "utf-8");
  const jsonData = JSON.parse(data);
  const foundElement = jsonData.find(
    (element) => element.link === collectionLink
  );
  return foundElement;
};

module.exports = getSingleCollection;
