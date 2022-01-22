const multer = require("multer");
const path = require("path");

// Ref:
// https://github.com/expressjs/multer#fieldsfields

exports.uploadFile = (objFN) => {
  // Destructure object fieldname (by type file)
  const listImageFN = (objFN.imageFN === undefined) ? [] : Object.keys(objFN.imageFN);
  const listMusicFN = (objFN.musicFN === undefined) ? [] : Object.keys(objFN.musicFN);

  // Define storage destination
  const storage = multer.diskStorage({
    destination: function (req, file, callback) {
      let destFile;
      if (listImageFN.includes(file.fieldname)) {
        destFile = "public/image";
      } else if (listMusicFN.includes(file.fieldname)) {
        destFile = "public/music";
      } else {
        return callback(new Error("Wrong type file!", false));
      }
      callback(null, destFile);
    },
    filename: function(req, file, callback) {
      callback(null, Date.now() + "-" + file.originalname.replace("/\s/g", ""));
    }
  });

  const fileFilter = (req, file, callback) => {
    if (listImageFN.includes(file.fieldname)) {
      if (!file.originalname.match(/\.(jpg|JPG|JPEG|jpeg|png|PNG)$/)) {
        const msgError = "Wrong type image files";
        req.fileValidationError = {
          message: msgError
        }
        return callback(new Error(msgError), false);
      }
      callback(null, true);
    } else if (listMusicFN.includes(file.fieldname)) {
      if (!file.originalname.match(/\.(mp3|MP3|wav|WAV)$/)) {
        const msgError = "Wrong type music files";
        req.fileValidationError = {
          message: msgError
        }
        return callback(new Error(msgError), false);
      }
      callback(null, true);
    }
  }

  // maximum size for file upload
  const sizeInMB = 10;
  const maxSize = sizeInMB * 1024 * 1024;

  const fieldsValue = () => {
    let result = [];
    for (const key in objFN.imageFN) {
      result.push({
        name: key,
        maxCount: objFN.imageFN[key]
      });
    }
    for (const key in objFN.musicFN) {
      result.push({
        name: key,
        maxCount: objFN.musicFN[key]
      });
    }
    return result;
  }

  const upload = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: maxSize
    }
  }).fields(fieldsValue());

  return (req, res, next) => {
    upload(req, res, function (err) {
      if (req.fileValidationError) {
        return res.status(400).send(req.fileValidationError);
      }

      // if file not exist
      if (!req.files && !err) {
        // code here if want to skip upload

        return res.status(400).send({
          message: "Please select file to upload"
        });
      }

      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).send({
            message: "Max file sized"
          });
        }
        return res.status(400).send(err);
      }
      console.log("File successfully uploaded");
      return next();
    });
  }
}