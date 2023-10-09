export function isValidFileExtensions(
  fileName: string,
  fileType: "image" | "video" | "pdf" | "pptx"
): boolean {
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
