const DataUriParser = require('datauri/parser');
const path = require('path');

const getDataUri = (files) => {
  const parser = new DataUriParser();
  const fileUris = files.map((file) => {
    const extName = path.extname(file.originalname).toString();
    return parser.format(extName, file.buffer);
  });
  return fileUris;
};

module.exports = getDataUri;