const encodeImage = require("./encodeImage");

async function generatePayload(title, product, boardId) {
  try {
    const payload = {
      link: product.productLink,
      title: title + " " + product.title,
      description: title + " " + product.title + " " + product.tags,
      alt_text: title + " " + product.title + " " + product.tags,
      board_id: boardId,
      media_source: {
        source_type: "image_base64",
        content_type: "image/jpeg",
        data: await encodeImage(product.imageLink),
      },
    };
    return payload;
  } catch (error) {
    console.log(error);
  }
}

module.exports = generatePayload;
