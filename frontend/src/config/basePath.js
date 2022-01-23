export const baseUploadImg = (filename) => {
  const baseDir = "http://localhost:5000/public/image/";
  return baseDir + filename;
}

export const baseUploadMusic = (filename) => {
  const baseDir = "http://localhost:5000/public/music/";
  return baseDir + filename;
}