const axios = require("axios");
var uuid = require("uuid");
const fs = require("fs");
const Jimp = require("jimp");
const puppeteer = require("puppeteer");
const { resolve } = require("path");
const file = "boards.json";
const data = require("./" + file);

let requestsNumber = 0;
const maxRequests = 4;
const token =
  "";
const config = {
  headers: { Authorization: `Bearer ${token}` },
};

const bodyParameters = {
  key: "value",
};

async function automate() {
  for (let i = 0; i < data.length; i++) {
    console.log(i);
    const design = data[i];
    let boardId = design.board_id || "";
    if (!design.shared) {
      if (!design.board_created) {
        if (requestsNumber < maxRequests) {
          let board = await createBoard(
            design.title,
            design.title + " Merch",
            i
          );
        } else {
          break;
        }
      }

      const products = design.products;
      for (let j = 0; j < products.length; j++) {
        console.log(i, j);
        const product = products[j];
        if (!product.shared) {
          if (requestsNumber < maxRequests) {
            const pin = await createPin(
              await generatePayload(design, j, boardId),
              i
            );
          } else {
            break;
          }
        }
      }
      // design shared == true
      try {
        setTimeout(() => {
          editDesignShared(i);
          console.log("Waiting 5s");
        }, 5000);
      } catch (error) {
        console.log(error);
      }
      console.log(requestsNumber);
    }
  }
}

automate();
