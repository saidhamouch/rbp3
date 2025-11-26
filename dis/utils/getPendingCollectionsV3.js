const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "../displates2.json"); // Replace with the path to your JSON file

const getPendingCollections = async () => {
  // Read the JSON file
  const data = fs.readFileSync(filePath, "utf-8");
  const jsonData = JSON.parse(data);
  let pendingCollections = jsonData
    .filter((col) => !col.shared) // Filter out elements where shared is truthy
    .map((col) => col.link); // Extract the link property

  return pendingCollections;
};

module.exports = getPendingCollections;
