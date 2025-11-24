const file = "displates.json";
const data = require("../" + file);

const fileDraft = "displatesDraft3.json";
const dataDraft = require("../" + fileDraft);

for (let index = 0; index < dataDraft.length; index++) {
  let collectionDraft = dataDraft[index];

  let foundCollection = data.find((obj) => obj.link === collectionDraft.link);

  let indexCollection = foundCollection ? data.indexOf(foundCollection) : -1;

  if (indexCollection !== -1) {
    let postersDraft = collectionDraft.posters;

    for (let j = 0; j < postersDraft.length; j++) {
      let poster = postersDraft[j];
      let oldPosters = data[indexCollection].posters;

      let foundPoster = oldPosters.find(
        (obj) => obj.posterLink === poster.posterLink
      );

      let indexPoster = foundPoster ? oldPosters.indexOf(foundPoster) : -1;

      console.log(indexPoster);
      if (indexPoster == -1) {
        data[indexCollection].posters.push(poster);
        data[indexCollection].shared = false;
      }
    }
  } else {
    data.push(collectionDraft);
  }
}

// Assuming you want to write the updated data back to the file
const fs = require("fs");
const updatedFilePath = "displatesUpdated3.json"; // Replace with your desired path
fs.writeFileSync(updatedFilePath, JSON.stringify(data, null, 2), "utf-8");

console.log("done");
