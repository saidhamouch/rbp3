const axios = require("axios");
const cheerio = require("cheerio");
const request = require("request");
const puppeteer = require("puppeteer");
const userAgent = require("user-agents");
var uuid = require("uuid");
const fs = require("fs");
const { log } = require("console");
const file = "new-displates.json";
const data = require("./" + file);

//const url = "https://displate.com/stanfordpouros";

function getDesignsConsoleRB() {
  var displates = [];
  var collections = document.querySelectorAll(
    "div.collection__header div.collection__title"
  );

  for (let i = 0; i < collections.length; i++) {
    var collection = {};
    var link =
      collections[i].getElementsByTagName("a")[0].getAttribute("href") ||
      "no-link";
    var title =
      collections[i].getElementsByTagName("a")[0].innerText || "no-title";
    collection.link = link;
    collection.title = title;
    collection.shared = false;
    displates.push(collection);
  }
}

async function scrapeData1() {
  // 1- Get Posters
  for (let index = 0; index < data.length; index++) {
    const element = data[index];
    const items = await getCollectionPosters(element.link, 1, []);
    data[index].posters = items;
  }
  fs.writeFile(file, JSON.stringify(data, null, 2), function (err) {
    console.log(err);
  });
}
async function scrapeData2() {
  /////////// NOT USED ///////////
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
}
async function scrapeData3() {
  // 3- Get Images Links

  for (let index = 0; index < data.length; index++) {
    const element = data[index];
    const postersList = element.posters;
    console.log(index, postersList.length);
    for (let idx = 0; idx < postersList.length; idx++) {
      console.time(index + " - " + idx);
      if (!postersList[idx].imageLink) {
        const designData =
          (await getProductImageAndTags(postersList[idx].posterLink)) ||
          "no-link";
        data[index].posters[idx].imageLink = designData.link;
        data[index].posters[idx].tags = designData.tags;
        data[index].posters[idx].title = designData.title;
        data[index].posters[idx].description = designData.description;
        fs.writeFile(file, JSON.stringify(data, null, 2), function (err) {
          console.log(err);
        });
      }
      console.timeEnd(index + " - " + idx);
    }
  }
}
async function getProductImageAndTags(url) {
  const html = await getDynamicPageHtml2(url);
  const $ = cheerio.load(html);
  const designData = {};
  const links = $(".MaskedImagestyled__InternalSvgImg-sc-9dwd2c-0.hlVRFy");
  const link =
    $(links[0])
      .attr("srcset")
      .split(" 1x")[0]
      .replace("135x190", "1016x1422") || "no-link";
  const array = [];
  const tags = $(".SeoTagsSection_linkSpan__kBLQj");
  tags.each((idx, el) => {
    const tag = $(el).text() || "no-title";
    console.log(tag);
    array.push(tag);
    array.push(tag + "posters");
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
  const titles = $(
    ".Heading__BaseHeading-sc-1oe4geb-0.xdQyV.HeroTitlestyled__Title-sc-1erk37g-4.mddYU"
  );
  const title = $(titles[0]).text();
  designData.title = title;
  const descriptions = $(
    ".BaseText-sc-10ro02n-0.hupyC.HeroTitlestyled__DescriptionText-sc-1erk37g-2.jiUpZv"
  );
  const description = $(descriptions[0]).text();
  designData.description = description;

  return designData;
}

async function getProducts(designLink) {
  const products = [];
  const html = await getDynamicPageHtml2(designLink);
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

async function getCollectionPosters(collectionUrl, page, posters) {
  var totalPosters = 0;
  var newUrl = collectionUrl + "?page=" + page;
  var allPosters = posters;

  var html = await getDynamicPageHtml2(newUrl);
  var $ = cheerio.load(html);

  // New selector
  var links = $("a.ElysiumLink_link__xHW5f");

  console.log("Found posters:", links.length);

  totalPosters = links.length;

  links.each(function (idx, el) {
    var poster = {};

    var link = $(el).attr("href") || "no-link";
    poster.posterLink = "https://displate.com" + link;
    poster.shared = false;
    poster.id = uuid.v4();

    allPosters.push(poster);
  });

  // Pagination: continues if 108 designs exist
  if (totalPosters == 108) {
    page++;
    await getCollectionPosters(collectionUrl, page, allPosters);
  }

  return allPosters;
}

async function getDynamicPageHtml(url) {
  try {
    console.log("before launch");
    const browser = await puppeteer.launch();
    //console.log("after launch - before new page");
    const page = await browser.newPage();
    //console.log("after new page - before request");
    /*
    await page.setRequestInterception(true);

    page.on("request", (request) => {
      if (request.resourceType() === "document") {
        request.continue();
      } else {
        request.abort();
      }
    });
*/
    //console.log("after request - before goto url");
    await page.goto(url, { waitUntil: "domcontentloaded" });
    await page.screenshot({ path: "example.png" });
    //console.log("after goto page - before page evaluate");
    const html = await page.evaluate(
      () => document.querySelector("*").outerHTML
    );

    //console.log("after page evaluate - before close");
    await browser.close();
    console.log("after close");
    return html;
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function getDynamicPageHtml2(url) {
  const browser = await puppeteer.launch({});
  try {
    const page = await browser.newPage();

    // viewport and device scale factor of my laptop
    await page.setViewport({ width: 2880, height: 1800, deviceScaleFactor: 2 });

    await page.goto(url, {
      timeout: 15 * 1000,
      waitUntil: ["domcontentloaded"],
    });

    // wait for 2 seconds
    await page.waitForTimeout(2000);

    //await page.screenshot({ path: "finance.png" });

    const html = await page.evaluate(
      () => document.querySelector("*").outerHTML
    );

    return html;
  } catch (e) {
    console.error(e);
  } finally {
    await browser.close();
  }
}

//scrapeData();

function test() {
  var total = 0;
  newData = data.map((collection) => {
    console.log({ name: collection.title, poster: collection.posters.length });
    total = total + collection.posters.length;
  });
  console.log(total);
}
scrapeData1();
