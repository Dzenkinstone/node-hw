const multer = require("multer");
const path = require("path");

const tempDir = path.join(__dirname, "../", "temp");

const multerConfig = multer.diskStorage({
  diskStorage: tempDir,
  fileName: (req, file, cb) => {
    cb(null, file.originalName);
  },
});

const upload = multer({
  storage: multerConfig,
});

module.exports = {
  upload,
};
