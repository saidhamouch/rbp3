const cron = require("node-cron");

const getPendingCollections = require("./utils/getPendingCollectionsV3");
const getSingleCollection = require("./utils/getSingleCollectionV3");
const createBoard = require("./utils/createBoardV3");
const updateCollectionBoardCreated = require("./utils/updateCollectionBoardCreatedV3");
const generatePayload = require("./utils/generatePinPayloadV3");
const createPin = require("./utils/createPin");
const updatePinShared = require("./utils/updatePinSharedV3");
const updateCollectionShared = require("./utils/updateCollectionBoardSharedV3");

const file = "displates2.json";
const data = require("./" + file);
cron.schedule("*/20 * * * * *", async () => {
  console.log("20 seconds passed: " + new Date().toJSON());
  try {
    // Get Pending Collections links
    const pendingCollections = await getPendingCollections();
    //console.log(pendingCollections);

    for (let i = 0; i < pendingCollections.length; i++) {
      const collectionLink = pendingCollections[i];

      // Get Collection (using link)
      const col = await getSingleCollection(collectionLink);
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
          collectionLink
        );

        // Board Id
        boardID = board.data.id;
      }

      // Loop Posters
      let posters = col.posters;
      for (let j = 0; j < posters.length; j++) {
        const poster = posters[j];

        if (!poster.shared) {
          // Generate Pin Payload
          const pinPayload = await generatePayload(j, poster, boardID);
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
                poster.id
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
              collectionLink
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
