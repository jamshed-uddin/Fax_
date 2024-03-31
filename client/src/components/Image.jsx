import React from "react";

const Image = ({ image, isOwn = true }) => {
  if (!image) return null;
  return (
    <div className="flex justify-end">
      <div className="w-60 h-60 rounded-lg">
        <img
          className="h-full w-full object-cover rounded-lg"
          src={image}
          alt="Image type message"
        />
      </div>
    </div>
  );
};

export default Image;
