const fs = require("fs");
const path = require("path");

const updateCollectionBoardCreated = async (collectionLink, filePath) => {
  try {
    // Read the content of the JSON file
    const fileContent = fs.readFileSync(filePath, "utf-8");

    // Parse the JSON content into an array of objects
    const jsonData = JSON.parse(fileContent);

    // Find the index of the element in the array based on the collectionLink
    const indexToUpdate = jsonData.findIndex(
      (element) => element.link === collectionLink
    );

    // Check if the element exists before proceeding
    if (indexToUpdate !== -1) {
      // Update the property you want to change (e.g., shared)
      jsonData[indexToUpdate].shared = true;

      // Write the updated data back to the JSON file
      fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), "utf-8");

      console.log("File updated successfully.");
    } else {
      console.error(`Element with link "${collectionLink}" not found.`);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

module.exports = updateCollectionBoardCreated;
