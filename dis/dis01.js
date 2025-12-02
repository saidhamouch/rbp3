const cron = require("node-cron");

const getPendingCollections = require("./utils/getPendingCollectionsV4");
const getSingleCollection = require("./utils/getSingleCollectionV4");
const createBoard = require("./utils/createBoardV4");
const updateCollectionBoardCreated = require("./utils/updateCollectionBoardCreatedV4");
const generatePayload = require("./utils/generatePinPayloadV4");
const createPin = require("./utils/createPin");
const updatePinShared = require("./utils/updatePinSharedV4");
const updateCollectionShared = require("./utils/updateCollectionBoardSharedV4");
const fileExists = require("./utils/fileExists");

const file = "displates01.json";
const data = require("./" + file);
const path = require("path");
const imagesPath = path.join(__dirname, "images", "Images 1");
const filePath = path.join(__dirname, file);
cron.schedule("*/20 * * * * *", async () => {
  console.log("20 seconds passed: " + new Date().toJSON());
  try {
    // Get Pending Collections links
    const pendingCollections = await getPendingCollections(filePath);
    //console.log(pendingCollections);

    for (let i = 0; i < pendingCollections.length; i++) {
      const collectionLink = pendingCollections[i];

      // Get Collection (using link)
      const col = await getSingleCollection(collectionLink, filePath);
      //console.log(pendingCollections);
      // Board Id
      let boardID = col.board_id || "";
      console.log(col.title);
      //console.log(pendingCollections);
      console.log();
      if (!col.board_created || false) {
        // Create Board
        const board = await createBoard(col.title);
        console.log("Board created");
        console.log(board.data.id);

        // Update Design
        const updatedBoardDesign = await updateCollectionBoardCreated(
          board.data.id,
          collectionLink,
          filePath
        );

        // Board Id
        boardID = board.data.id;
      }

      // Loop Posters
      let posters = col.posters;
      for (let j = 0; j < posters.length; j++) {
        const poster = posters[j];
        const posterExists = await fileExists(
          poster.externalId,
          imagesPath,
          ".png"
        );

        if (!poster.shared && posterExists) {
          // Generate Pin Payload
          const pinPayload = await generatePayload(
            j,
            poster,
            boardID,
            imagesPath
          );
          // Create Pin
          if (
            !poster.imageLink.includes("preview-reference-assets") &&
            !poster.imageLink.includes("no-link")
          ) {
            const pin = await createPin(pinPayload);
            console.log("Pin created");
            // Update poster
            if (pin.data.id) {
              const updatePoster = await updatePinShared(
                collectionLink,
                poster.id,
                filePath
              );
              console.log("Poster updated");
            }
          } else {
            const updateProduct = await updatePinShared(
              collectionLink,
              poster.id
            );
            console.log("Product skipped");
          }
          if (j == posters.length - 1) {
            const updatePostersAllShared = await updateCollectionShared(
              collectionLink,
              filePath
            );
            console.log("Design Updated");
          } else {
            console.log(`${j + 1}/${posters.length}`);
          }
          break;
        }
      }

      // Update Design - All posters Shared
      break;
    }
  } catch (error) {
    console.log(error);
  }
});
