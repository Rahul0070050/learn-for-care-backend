export function isValidFileExtensions(fileName, fileType) {
  const validFileExtensions = {
    image: ["jpg", "png", "jpeg", "webp"],
    video: ["mp4", , "mkv", "webm"],
    pptx: ["pptx"],
    pdf: ["pdf"],
    resource: ["pdf", "mp4", "mkv", "webm","txt","docx"],
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
    resource: ["pdf", "mp4", "mkv", "webm","txt","docx"],
  };
  return validFileExtensions[`${fileType}`].includes(fileName.split(".").pop())
}
