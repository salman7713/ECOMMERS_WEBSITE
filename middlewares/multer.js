const multer = require('multer');

const storage = multer.memoryStorage();

const singleUpload = multer({storage}).array("images");

module.exports = singleUpload;