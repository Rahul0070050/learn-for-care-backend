export function isValidFileExtensions(fileName, fileType) {
  const validFileExtensions = {
    image: ["jpg", "png", "jpeg", "webp"],
    video: ["mp4", "mkv", "webm"],
    pptx: ["pptx"],
    pdf: ["pdf"],
    resource: [
      "pdf",
      "mp4",
      "mkv",
      "webm",
      "txt",
      "docx",
      "jpg",
      "jpeg",
      "webp",
      "png",
    ],
    ExpAndQulFiles: ["docx", "pdf", "doc"],
  };
  return (
    validFileExtensions[fileType].indexOf(fileName.split(".").pop() || "") > -1
  );
}

export function validFileExtension(fileName, fileType) {
  const validFileExtensions = {
    image: ["jpg", "png", "jpeg", "webp"],
    video: ["mp4", , "mkv", "webm"],
    pptx: ["pptx"],
    pdf: ["pdf"],
    resource: [
      "pdf",
      "mp4",
      "mkv",
      "webm",
      "txt",
      "docx",
      "jpeg",
      "webp",
      "png",
    ],
    ExpAndQulFiles: ["docx", "pdf", "doc"],
  };
  return validFileExtensions[`${fileType}`].includes(fileName.split(".").pop());
}
