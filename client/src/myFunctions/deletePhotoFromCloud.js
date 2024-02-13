import axios from "axios";

const deletePhotoFromCloud = async (url) => {
  const splitedURL = url.split("/");
  const public_id = `${splitedURL.at(-2)}/${splitedURL
    .at(-1)
    .split(".")
    .at(0)}`;

  async function digestMessage() {
    const dToSign = `public_id=${public_id}&timestamp=${Math.floor(
      Date.now() / 1000
    )}${import.meta.env.VITE_CLOUDY_API_SECRET}`;
    const msgUint8 = new TextEncoder().encode(dToSign);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join(""); // convert bytes to hex string
    return hashHex;
  }

  try {
    const hash = await digestMessage();

    const respons = await axios.post(
      `https://api.cloudinary.com/v1_1/${
        import.meta.env.VITE_CLOUD_NAME
      }/image/destroy`,
      {
        public_id: public_id,
        api_key: import.meta.env.VITE_APIKEY,
        signature: hash,
        timestamp: Math.floor(Date.now() / 1000),
      },
      {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
      }
    );

    return respons;
  } catch (error) {
    return error;
  }
};

export default deletePhotoFromCloud;
