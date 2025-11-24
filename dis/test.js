const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "posters.json");

try {
  // 1. Read the file
  const raw = fs.readFileSync(filePath, "utf8");
  const data = JSON.parse(raw);

  if (!Array.isArray(data)) {
    throw new Error("posters.json does not contain an array!");
  }

  // 2. Filter objects
  const filtered = data.filter((item) => item.validationStatus === "PUBLISHED");

  // 3. Save back to the same file
  fs.writeFileSync(filePath, JSON.stringify(filtered, null, 2));

  console.log(`✔ Done! Saved ${filtered.length} items to posters.json`);
} catch (error) {
  console.error("❌ Error:", error.message);
}
