import React, { useEffect, useState } from "react";
import Searchbar from "../components/Searchbar";
import useGetSearchResult from "../hooks/useGetSearchResult";
import useDebounce from "../hooks/useDebouce";

import UserCard from "../components/UserCard";
import CardSkeleton from "../components/CardSkeleton";
import NavigateBack from "../components/NavigateBack";
import {
  CheckIcon,
  MinusIcon,
  PencilSquareIcon,
  PhotoIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import useCloseMenu from "../hooks/useCloseMenu";
import uploadPhotoToCloud from "../myFunctions/uploadPhotoToCloud";
import deletePhotoFromCloud from "../myFunctions/deletePhotoFromCloud";

const CreateGroup = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const bouncedQuery = useDebounce(searchQuery, 600);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [photoUploading, setPhotoUploading] = useState("");
  const [profilePhotoURL, setProfilePhotoURL] = useState("");
  const [groupData, setGroupData] = useState({
    chatName: "",
    chatDescription: "",
    chatPhotoURL: "",
    users: [],
  });

  const { data: searchResult, isLoading: searchLoading } =
    useGetSearchResult(bouncedQuery);

  const handleTextInput = (e) => {
    setGroupData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const selectOrRemoveUser = (selectedUser, action) => {
    if (action === "remove") {
      return setSelectedUsers((users) =>
        users.filter((user) => user._id !== selectedUser._id)
      );
    }

    if (selectedUsers.some((user) => user._id === selectedUser._id)) return;

    setSelectedUsers((users) => [...users, selectedUser]);
  };

  useEffect(() => {
    setGroupData((p) => ({ ...p, users: selectedUsers }));
  }, [selectedUsers]);

  const { isMenuOpen: uploaderOpen, setIsMenuOpen: setUploaderOpen } =
    useCloseMenu("photoUploader");

  const removeProfilePhoto = async () => {
    setProfilePhotoURL("");
    setUploaderOpen((p) => !p);
    const response = await deletePhotoFromCloud(profilePhotoURL);
    console.log(response);
  };

  const handleProfilePhotoChange = async (e) => {
    const file = e.target.files[0];
    const previewURL = URL.createObjectURL(file);
    setProfilePhotoURL(previewURL);

    setUploaderOpen((p) => !p);
    if (file) {
      try {
        setPhotoUploading(true);
        await uploadPhotoToCloud(file).then((res) => {
          console.log(res);
          const cloudImageUrl = res.data.secure_url;
          setPhotoUploading(false);
          setProfilePhotoURL(cloudImageUrl);
        });
      } catch (error) {
        setPhotoUploading(false);
      }
    }
  };

  return (
    <div className="overflow-y-auto h-full w-full pt-3 lg:px-2 pb-10">
      <div className=" flex items-center justify-between">
        <NavigateBack />
        <div>
          <button className=" btn btn-sm no-animation bg-slate-300 text-xl">
            Create
          </button>
        </div>
      </div>
      <div className="h-max space-y-2">
        {/* group photo */}
        <div className="flex justify-center ">
          <div className="relative ">
            <div className="  h-36 w-36 bg-slate-200 rounded-full">
              <img
                className=" w-full h-full object-cover rounded-full"
                src={profilePhotoURL}
                alt=""
              />
            </div>

            {/*  image upload button */}

            <div id="photoUploader" className=" absolute right-0 bottom-0 ">
              <div className="relative">
                <button
                  onClick={() => setUploaderOpen((p) => !p)}
                  className="w-fit rounded  cursor-pointer active:scale-95   "
                >
                  <PencilSquareIcon className="w-6 h-6" />
                </button>

                {/* image upload and delete option */}
                {uploaderOpen && (
                  <div
                    className={` flex gap-2 md:gap-5 rounded-lg px-1 py-1 md:px-3 shadow-md absolute bottom-2 -right-28 `}
                  >
                    <div className=" p-1  rounded-lg text-lg cursor-pointer ">
                      <label className="cursor-pointer" htmlFor="profilePhoto">
                        <PhotoIcon className="w-5 h-5" />
                      </label>
                      <input
                        onChange={handleProfilePhotoChange}
                        type="file"
                        name="profilePhoto"
                        id="profilePhoto"
                        className="hidden"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={removeProfilePhoto}
                      className=" p-1  rounded-lg text-lg cursor-pointer active:bg-slate-50 active:scale-90"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {photoUploading ? (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <span className="loading loading-spinner  w-12 text-slate-300"></span>
              </div>
            ) : null}
          </div>
        </div>
        {/* name */}
        <div className="flex flex-col gap-3 items-center ">
          <input
            type="text"
            placeholder="Group name"
            className="input text-lg border-0 border-b-[1px] border-black rounded-none focus:outline-0 focus:border-b-[1.5px] focus:border-0 w-3/4 lg:w-1/2 focus:border-slate-600"
            name="chatName"
            value={groupData.chatName}
            onChange={handleTextInput}
          />
          <textarea
            name="chatDescription"
            placeholder="Description"
            className="textarea text-lg border-0 border-b-[1px] border-slate-500 rounded-none focus:outline-0 focus:border-b-[1.5px] focus:border-slate-600  w-3/4 lg:w-1/2"
            value={groupData.chatDescription}
            onChange={handleTextInput}
          ></textarea>
        </div>
        {/* added members */}
        <div className="">
          <h1 className="text-2xl font-medium">Add members</h1>
          <div className="overflow-x-auto mt-2">
            <div className="py-1 mt-2 flex items-center gap-3 flex-nowrap w-max">
              {selectedUsers.map((user) => (
                <div
                  key={user._id}
                  className="shadow-md rounded-xl px-2 py-1 w-fit relative"
                >
                  <UserCard user={user} />
                  <div
                    onClick={() => selectOrRemoveUser(user, "remove")}
                    className="rounded-full bg-red-400 w-fit  absolute -top-2 -right-2 cursor-pointer "
                  >
                    <MinusIcon className="text-white w-5 h-5 " />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* search user */}
        <div>
          <div className="lg:w-1/2 mx-auto">
            <Searchbar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </div>
          {/* search result */}
          <div className="mt-4 flex justify-center ">
            <div className="w-full lg:w-1/2 space-y-3">
              {searchLoading && bouncedQuery ? (
                <CardSkeleton cardAmount={2} />
              ) : bouncedQuery.length &&
                !searchLoading &&
                !searchResult?.users?.length ? (
                <div>
                  <h1 className="text-center">No user found</h1>
                </div>
              ) : (
                searchResult?.users.map((user) => (
                  <div
                    onClick={() => selectOrRemoveUser(user)}
                    key={user?._id}
                    className={`shadow-md rounded-xl px-2 py-1 relative`}
                  >
                    <UserCard user={user} />
                    <div className="absolute -top-1 -right-1 shadow-md rounded-full">
                      {selectedUsers.some(
                        (selectedUser) => selectedUser._id === user._id
                      ) && (
                        <CheckIcon className="w-5 h-5 rounded-full bg-green-400 p-1 text-white" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGroup;
