const DataUriParser = require("datauri/parser");
const path = require("path");

const getDataURI = (file) => {
  const parser = new DataUriParser();

  const extName = path.extname(file.originalname).toString();
  console.log("fileExt", extName);

  return parser.format(extName, file.buffer);
};

module.exports = getDataURI;
