import React, { useEffect } from "react";

const Image = ({ image, isOwn = true, loading = false }) => {
  if (!image) return null;
  return (
    <div className={`flex  w-full ${isOwn ? "justify-end" : "justify-start"}`}>
      <div className="w-60 h-60 rounded-lg relative">
        <img
          className="h-full w-full object-cover rounded-lg"
          src={image}
          alt="Image type message"
        />
        {loading && (
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <span className="loading loading-spinner loading-lg text-gray-100 "></span>
          </span>
        )}
      </div>
    </div>
  );
};

export default Image;
