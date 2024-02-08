import React from "react";

const Modal = ({ modalFor, isModalOpen, setIsModalOpen, chatId, userId }) => {
  return (
    <div
      className={`w-11/12 p-3 lg:w-2/5 h-36 mx-auto  bg-white shadow-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 rounded-xl ${
        !isModalOpen && "hidden"
      }`}
    >
      <div className=" flex flex-col h-full">
        <h1 className="flex-grow text-xl font-medium">
          {modalFor === "deleteChat"
            ? "Delete this conversation?"
            : "Leave this group?"}
        </h1>

        <div className="text-end space-x-2 ">
          {modalFor === "deleteChat" ? (
            <button className="btn btn-sm btn-error text-white">Delete</button>
          ) : (
            <button className="btn btn-sm btn-error text-white">Leave</button>
          )}
          <button
            onClick={() => setIsModalOpen((p) => !p)}
            className="btn btn-sm "
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
