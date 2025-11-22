[
  {
    link: "https://displate.com/stanfordpouros/the-legend",
    title: "The Legend",
    shared: false,
  },
  {
    link: "https://displate.com/stanfordpouros/sport-drawing",
    title: "Sport Drawing",
    shared: false,
  },
  {
    link: "https://displate.com/stanfordpouros/soccer-player",
    title: "Soccer Player",
    shared: false,
  },
  {
    link: "https://displate.com/stanfordpouros/music-poster-art",
    title: "Music Poster Art",
    shared: false,
  },
  {
    link: "https://displate.com/stanfordpouros/abstract-player-soccer",
    title: "Abstract Player Soccer",
    shared: false,
  },
];

const fs = require("fs");
const path = require("path");

const folderPath = "E:/Said/PO/Mid 3/Upscaled/AMA - PNG/Cropped"; // Replace with the path to your folder

var files = [];
// Use the 'readdir' function to read the contents of the directory
fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.error("Error reading folder:", err);
    return;
  }

  // 'files' is an array of file names in the folder
  console.log("Files in the folder:");
  files.forEach((file) => {
    files.push(file);
    console.log(file);
  });
});
