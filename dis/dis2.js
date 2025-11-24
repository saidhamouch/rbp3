const cron = require("node-cron");
const fs = require("fs");

const generatePayload = require("./utils/generatePinPayloadV2");
const createPin = require("./utils/createPinV2");

const file = "posters.json";

// Load full array
let data = require("./" + file);
console.log("Total posters loaded:", data.length);

cron.schedule("*/20 * * * * *", async () => {
  console.log("20 seconds passed: " + new Date().toJSON());
  try {
    // Find the first poster that is not shared
    const poster = data.find((item) => item.shared !== true);

    if (!poster) {
      console.log("No unshared posters left.");
      return;
    }

    const index = data.indexOf(poster);

    // Generate Pin Payload
    const pinPayload = await generatePayload(index, poster);

    // Create Pin
    const pin = await createPin(pinPayload);
    console.log("Pin created:", pin.data.id);

    // ⭐ Update poster
    poster.shared = true;
    poster.pin_id = pin.data.id;

    // ⭐ Save full array back to file
    fs.writeFileSync(file, JSON.stringify(data, null, 2));

    console.log("Poster updated & saved.");
  } catch (error) {
    console.log(error);
  }
});
