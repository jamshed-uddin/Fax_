import { useState } from "react";

const Image = ({ image, loading = false }) => {
  const [orientation, setOrientation] = useState(0);

  const handleImageDimension = (e) => {
    const { naturalWidth, naturalHeight } = e.target;
    setOrientation(naturalWidth / naturalHeight);
  };

  if (!image) return null;
  return (
    <div
      className={`rounded-lg relative ${
        orientation > 1 ? "max-w-80" : "max-w-48"
      } `}
    >
      <img
        onLoad={handleImageDimension}
        className={` w-auto h-auto   object-cover rounded-lg`}
        src={image}
        alt="Image type message"
      />
      {loading && (
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <span className="loading loading-spinner loading-lg text-gray-100 "></span>
        </span>
      )}
    </div>
  );
};

export default Image;
