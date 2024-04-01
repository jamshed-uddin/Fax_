const cloudinary = require("cloudinary").v2;

const configureCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_APIKEY,
    api_secret: process.env.CLOUD_API_SECRET,
  });
};

const uploadToCLoud = async (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject("No file found");
    }
    cloudinary.uploader.upload(
      file,
      { upload_preset: process.env.CLOUD_UPLOAD_PRESET },
      (error, result) => {
        if (error) {
          console.log("uploading error", error);
          reject(error);
        } else {
          resolve({ url: result.secure_url, publicId: result.public_id });
        }
      }
    );
  });
};

module.exports = { configureCloudinary, uploadToCLoud };
