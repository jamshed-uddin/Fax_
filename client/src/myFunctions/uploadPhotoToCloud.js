import axios from "axios";

const uploadPhotoToCloud = async (file) => {
  try {
    const imageData = new FormData();
    imageData.append("file", file);
    imageData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${
        import.meta.env.VITE_CLOUD_NAME
      }/image/upload`,
      imageData,
      {
        headers: { "X-Requested-With": "XMLHttpRequest" },
      }
    );
    return response;
  } catch (error) {
    return;
  }
};

export default uploadPhotoToCloud;
