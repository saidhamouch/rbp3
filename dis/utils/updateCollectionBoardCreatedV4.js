const fs = require("fs");
const path = require("path");

const updateCollectionBoardCreated = async (boardID, collectionLink, file) => {
  const filePath = path.join(__dirname, file); // Replace with the path to your JSON file

  // Read the content of the JSON file
  const fileContent = fs.readFileSync(filePath, "utf-8");

  // Parse the JSON content into an array of objects
  const jsonData = JSON.parse(fileContent);

  // Update the element in the array based on the ID
  const updatedData = jsonData.map((element) => {
    if (element.link === collectionLink) {
      // Update the property you want to change (e.g., name)
      return { ...element, board_id: boardID, board_created: true };
    } else {
      return element;
    }
  });

  // Write the updated data back to the JSON file
  fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2), "utf-8");
};

module.exports = updateCollectionBoardCreated;
