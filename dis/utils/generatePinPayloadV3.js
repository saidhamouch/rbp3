const encodeImage = require("./encodeImage");

async function generatePayload(index, poster, boardId) {
  try {
    const payload = {
      link: poster.posterLink + "?art=5eda570e734ef",
      title: poster.title + " " + "Metal Poster" + " - " + index,
      description:
        poster.description + " " + "Displate Metal Poster" + " " + poster.tags,
      alt_text:
        poster.description + " " + "Displate Metal Poster" + " " + poster.tags,
      board_id: boardId,
      media_source: {
        source_type: "image_base64",
        content_type: "image/jpeg",
        data: await encodeImage(poster.imageLink),
      },
    };
    return payload;
  } catch (error) {
    console.log(error);
  }
}

module.exports = generatePayload;
