const axios = require("axios");
const cheerio = require("cheerio");
const request = require("request");
const puppeteer = require("puppeteer");
const userAgent = require("user-agents");
var uuid = require("uuid");
const fs = require("fs");
const file = "fives2.json";
const data = require("./" + file);

const url = "https://www.redbubble.com/en/people/Kawiku/Fives55";

function getDesignsConsoleRB() {
  const designs = [];
  const links = document.getElementsByClassName("styles__link--3QJ5N");
  const titles = document.getElementsByClassName(
    "styles__box--2Ufmy styles__text--23E5U styles__display6--3wsBG styles__nowrap--33UtL"
  );
  for (let i = 0; i < titles.length; i++) {
    const design = {};
    const link = links[i].getAttribute("href") || "no-link";
    const title = titles[i].innerText || "no-title";
    design.productsLink = link;
    design.title = title;
    design.shared = false;
    designs.push(design);
  }
}

async function scrapeData() {
  // 1- Get Designs

  const items = await getDesigns("https://www.redbubble.com/shop/ap/152998617");
  fs.writeFile(file, JSON.stringify(items, null, 2), function (err) {
    console.log(err);
  });

  /*
  // 2- Get Products Links
  for (let index = 0; index < data.length; index++) {
    const element = data[index];
    const items = await getProducts(element.productsLink);
    console.log(index, items.length);
    data[index].id = uuid.v4();
    data[index].products = items;
  }
  fs.writeFile(file, JSON.stringify(data, null, 2), function (err) {
    console.log(err);
  });

  */
  /*
  // 3- Get Images Links
  for (let index = 0; index < data.length; index++) {
    const element = data[index];
    const productsList = element.products;
    console.log(index, productsList.length);
    for (let idx = 0; idx < productsList.length; idx++) {
      console.time(index + " - " + idx);
      if (!productsList[idx].imageLink) {
        const designData =
          (await getProductImageAndTags(productsList[idx].productLink)) ||
          "no-link";
        data[index].products[idx].imageLink = designData.link;
        data[index].products[idx].tags = designData.tags;
        fs.writeFile(file, JSON.stringify(data, null, 2), function (err) {
          console.log(err);
        });
      }
      console.timeEnd(index + " - " + idx);
    }
  }
  */
}

async function getProductImageAndTags(url) {
  const html = await getDynamicPageHtml(url);
  const $ = cheerio.load(html);
  const designData = {};
  const links = $(".GalleryImage__img--2Epz2");
  const index = Math.min(links.length - 1, 3);
  const link = $(links[index]).attr("src") || "no-link";
  const array = [];
  const tags = $(
    "#work-tags .styles__box--2Ufmy.styles__marginBottom-m--2W0L-.styles__marginRight-xs--13bZk"
  );
  tags.each((idx, el) => {
    const tag = $(el).text() || "no-title";
    array.push(tag);
  });
  designData.link = link;
  designData.tags = array
    .map((tag) => {
      return (
        "#" +
        tag
          .replace(/[^a-zA-Z0-9]/g, "")
          .split(" ")
          .join("")
      );
    })
    .join(" ");
  return designData;
}

async function getProducts(designLink) {
  const products = [];
  const html = await getDynamicPageHtml(designLink);
  const $ = cheerio.load(html);
  const productTitles = $(
    ".styles__box--2Ufmy.styles__text--23E5U.styles__display6--3wsBG.styles__nowrap--33UtL.styles__display-block--3kWC4"
  );
  const productLinks = $(".styles__link--3QJ5N");

  productTitles.each((idx, el) => {
    const prod = {};
    const link = $(productLinks[idx]).attr("href") || "no-link";
    const title = $(el).text() || "no-title";
    prod.productLink = link;
    prod.title = title;
    prod.id = uuid.v4();
    prod.shared = false;
    products.push(prod);
  });
  return products;
}

async function getDesigns(url) {
  const designs = [];
  const html = await getDynamicPageHtml(url);
  const $ = cheerio.load(html);
  const links = $(".styles__link--3QJ5N");
  const titles = $(
    ".styles__box--2Ufmy.styles__text--23E5U.styles__display6--3wsBG.styles__nowrap--33UtL"
  );
  console.log(html);
  console.log(titles.length);
  titles.each((idx, el) => {
    const design = {};
    const link = $(links[idx]).attr("href") || "no-link";
    const title = $(el).text() || "no-title";
    design.productsLink = link;
    design.title = title;
    design.shared = false;
    design.id = uuid.v4();
    designs.push(design);
  });
  return designs;
}

async function getDynamicPageHtml(url) {
  try {
    console.log("before launch");
    const browser = await puppeteer.launch();
    console.log("after launch - before new page");
    const page = await browser.newPage();
    console.log("after new page - before request");
    await page.setRequestInterception(true);

    page.on("request", (request) => {
      if (request.resourceType() === "document") {
        request.continue();
      } else {
        request.abort();
      }
    });

    console.log("after request - before goto url");
    await page.goto(url);
    console.log("after goto page - before page evaluate");
    const html = await page.evaluate(
      () => document.querySelector("*").outerHTML
    );
    console.log("after page evaluate - before close");
    await browser.close();
    console.log("after close");
    return html;
  } catch (err) {
    console.error(err);
    return null;
  }
}

scrapeData();
