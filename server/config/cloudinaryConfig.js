const cloudinary = require("cloudinary").v2;

const configureCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });
};

const uploadToCLoud = async (file) => {
  if (!file) return;
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(file.path, (error, result) => {
      if (error) {
        console.log("uploading error", error);
        reject(error);
      } else {
        resolve(result.secure_url);
      }
    });
  });
};

module.exports = { configureCloudinary, uploadToCLoud };
