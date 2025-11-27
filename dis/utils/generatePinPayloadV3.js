const encodeImage = require("./encodeImage");

async function generatePayload(index, poster, boardId) {
  try {
    let description =
      poster.description + " Displate Metal Poster. " + poster.tags;

    let altText = poster.description + " Displate Metal Poster. " + poster.tags;

    // apply trimming rules
    description = trimToLimit(description, 500);
    altText = trimToLimit(altText, 500);

    const payload = {
      link: poster.posterLink + "?art=5eda570e734ef",
      title: poster.title + " Metal Poster - " + index,
      description,
      alt_text: altText,
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

// Trim a string by removing last ", ..." chunks until below maxLength
function trimToLimit(text, maxLength) {
  if (text.length <= maxLength) return text;

  let parts = text.split(",");
  while (parts.length > 1 && text.length > maxLength) {
    parts.pop(); // remove last chunk
    text = parts.join(",").trim();

    // ensure it ends cleanly with a period
    if (!text.endsWith(".")) text += ".";
  }

  // If still too long, hard truncate
  if (text.length > maxLength) {
    text = text.substring(0, maxLength - 1).trim();
    if (!text.endsWith(".")) text += ".";
  }

  return text;
}

module.exports = generatePayload;
