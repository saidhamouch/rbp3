const fs = require("fs");
const path = require("path");

// Replace 'your-folder-path' with the path to your folder
const folderPath = path.join("D:/Said/PO/MID/Mid 11/JPGs/7");

fs.readdir(folderPath, (err, files) => {
  if (err) {
    return console.error("Unable to scan directory: " + err);
  }

  // Listing all files using forEach
  files.forEach((file) => {
    console.log(file.replace(".jpg", "").replace("copy", ""));
  });
});
