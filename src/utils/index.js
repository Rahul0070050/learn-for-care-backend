export function isValidFileExtensions(
  fileName,
  fileType
) {
  const validFileExtensions = {
    image: ["jpg", "png", "jpeg", "webp"],
    video: ["mp4"],
    pptx: ["pptx"],
    pdf: ["pdf"],
  };
  return (
    validFileExtensions[fileType].indexOf(fileName.split(".").pop() || "") > -1
  );
}
