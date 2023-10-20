export function isValidFileExtensions(fileName, fileType) {
  const validFileExtensions = {
    image: ["jpg", "png", "jpeg", "webp"],
    video: ["mp4", , "mkv", "webm"],
    pptx: ["pptx"],
    pdf: ["pdf"],
    resource: ["pdf", "mp4", "mkv", "webm"],
  };
  return (
    validFileExtensions[fileType].indexOf(fileName.split(".").pop() || "") > -1
  );
}
