const fs = require("fs-extra");
const path = require("path");
const XLSX = require("xlsx");

// 👉 Your course path here (edit anytime)
const COURSE_PATH =
  "C:/Users/saidh/Desktop/Said/Courses/IBM/Coursera - IBM Generative AI Engineering Professional Certificate";

// ------------------------------------------

async function scanDirectory(dir, parentChapters = []) {
  const results = [];

  const items = await fs.readdir(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);

    if (item.isDirectory()) {
      const chapterInfo = [...parentChapters, item.name];
      const sub = await scanDirectory(fullPath, chapterInfo);
      results.push(...sub);
    } else if (item.isFile() && item.name.match(/\.(mp4|mkv|mov)$/i)) {
      results.push({
        chapter: parentChapters[0] || "",
        subchapter: parentChapters[1] || "",
        subsubchapter: parentChapters[2] || "",
        video: item.name,
        done: "",
      });
    }
  }
  return results;
}

async function generateExcel(inputPath, outputName = "course_tracker.xlsx") {
  console.log("Scanning folder:", inputPath);

  const rows = await scanDirectory(inputPath);

  const sheetData = [
    ["Chapter", "Subchapter", "Sub-subchapter", "Video", "Done"],
  ];

  rows.forEach((r) => {
    sheetData.push([r.chapter, r.subchapter, r.subsubchapter, r.video, r.done]);
  });

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(sheetData);

  rows.forEach((r, i) => {
    ws[`E${i + 2}`] = { t: "b", v: false }; // checkbox-like boolean
  });

  XLSX.utils.book_append_sheet(wb, ws, "Course Progress");

  XLSX.writeFile(wb, outputName);

  console.log("Excel generated:", outputName);
}

// Run automatically using the constant path
generateExcel(COURSE_PATH);
