const fs = require("fs");
const path = require("path");

const updatePinShared = async (collectionLink, posterID, file) => {
  const filePath = path.join(__dirname, file); // Replace with the path to your JSON file

  try {
    // Read the JSON file
    const data = fs.readFileSync(filePath, "utf-8");
    const jsonData = JSON.parse(data);

    // Find the element based on the "link" property
    const elementToUpdate = jsonData.find(
      (element) => element.link === collectionLink
    );

    // Update the element in the array based on the ID
    const updatedData = elementToUpdate.posters.map((element) => {
      if (element.id === posterID) {
        // Update the property you want to change (e.g., shared)
        return { ...element, shared: true };
      } else {
        return element;
      }
    });

    // Update the posters array in the original element
    elementToUpdate.posters = updatedData;

    // Write the modified data back to the file using async/await
    await fs.promises.writeFile(
      filePath,
      JSON.stringify(jsonData, null, 2),
      "utf-8"
    );

    console.log("File updated successfully.");
  } catch (error) {
    console.error("Error:", error);
  }
};

module.exports = updatePinShared;
