const fs = require("fs");
const path = require("path");

const getPendingCollections = async (file) => {
  const filePath = path.join(__dirname, file); // Replace with the path to your JSON file

  // Read the JSON file
  const data = fs.readFileSync(filePath, "utf-8");
  const jsonData = JSON.parse(data);
  let pendingCollections = jsonData
    .filter((col) => !col.shared) // Filter out elements where shared is truthy
    .map((col) => col.link); // Extract the link property

  return pendingCollections;
};

module.exports = getPendingCollections;
