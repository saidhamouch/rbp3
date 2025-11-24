const encodeImage = require("./encodeImage");

async function generatePayload(index, poster) {
  try {
    const payload = {
      link:
        "https://displate.com/displate/" +
        poster.externalId +
        "?art=5eda570e734ef",
      title: poster.title + " " + "Displate Metal Poster" + " - " + index,
      description: poster.title + " " + "Displate Metal Poster" + " ",
      alt_text: poster.title + " " + "Displate Metal Poster" + " ",
      board_id: "814799826273875240",
      media_source: {
        source_type: "image_base64",
        content_type: "image/jpeg",
        data: await encodeImage(poster.imageUrl),
      },
    };
    return payload;
  } catch (error) {
    console.log(error);
  }
}

module.exports = generatePayload;
