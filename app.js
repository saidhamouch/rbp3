const express = require("express");
const app = express();
const cron = require("node-cron");

const connectDB = require("./db/connect");

const designs = require("./routes/designs");

const getPendingDesigns = require("./utils/getPendingDesigns");
const getSingleDesign = require("./utils/getSingleDesign");
const createBoard = require("./utils/createBoard");
const updateDesignBoardCreated = require("./utils/updateDesignBoardCreated");
const generatePayload = require("./utils/generatePinPayload");
const createPin = require("./utils/createPin");
const updatePinShared = require("./utils/updatePinShared");
const updateDesignShared = require("./utils/updateDesignShared");

const errorHandlerMiddleware = require("./middleware/error-handler");

const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

// middleware

app.use(express.json());
app.use(errorHandlerMiddleware);

// Routes
app.use("/api/v1/designs", designs);

const port = process.env.PORT || 5000;

connectDB(process.env.MONGO_URI);
console.log(`Connected to DB`);
app.listen(port, () => console.log(`Server is listening on port ${port}...`));

cron.schedule("*/20 * * * * *", async () => {
  console.log("20 seconds passed: " + new Date().toJSON());
  try {
    // Get Pending Designs IDs
    const pendingDesigns = await getPendingDesigns();

    for (let i = 0; i < pendingDesigns.length; i++) {
      const designID = pendingDesigns[i].id;

      // Get Design (using id)
      const design = await getSingleDesign(designID);

      // Board Id
      let boardID = design.board_id || "";

      if (!design.board_created) {
        // Create Board
        const board = await createBoard(design.title, design.index);
        console.log("Board created");
        // Update Design
        const updatedBoardDesign = await updateDesignBoardCreated(
          board.data.id,
          design.id
        );

        // Board Id
        boardID = board.data.id;
      }

      // Loop Products
      let products = design.products;
      for (let j = 0; j < products.length; j++) {
        const product = products[j];

        if (!product.shared) {
          // Generate Pin Payload
          const pinPayload = await generatePayload(
            design.title,
            product,
            boardID
          );
          // Create Pin
          if (
            !product.imageLink.includes("preview-reference-assets") &&
            !product.imageLink.includes("no-link")
          ) {
            const pin = await createPin(pinPayload);
            console.log("Pin created");
            // Update Product
            if (pin.data.id) {
              const updateProduct = await updatePinShared(
                design.id,
                product.id
              );
              console.log("Product updated");
            }
          } else {
            const updateProduct = await updatePinShared(design.id, product.id);
            console.log("Product skipped");
          }
          if (j == products.length - 1) {
            const updateDesignAllShared = await updateDesignShared(design.id);
            console.log("Design Updated");
          } else {
            console.log(`${j + 1}/${products.length}`);
          }
          break;
        }
      }
      // Update Design - All Products Shared
      break;
    }
  } catch (error) {
    console.log(error);
  }
});

const start = async () => {};

//start();
