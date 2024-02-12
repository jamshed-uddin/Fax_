import React, { useEffect, useState } from "react";
import Searchbar from "../components/Searchbar";
import useGetSearchResult from "../hooks/useGetSearchResult";
import useDebounce from "../hooks/useDebouce";

import UserCard from "../components/UserCard";
import CardSkeleton from "../components/CardSkeleton";
import NavigateBack from "../components/NavigateBack";
import { CheckIcon, MinusIcon } from "@heroicons/react/24/outline";

const CreateGroup = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const bouncedQuery = useDebounce(searchQuery, 600);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupData, setGroupData] = useState({
    chatName: "",
    chatDescription: "",
    chatPhotoURL: "",
    users: [],
  });

  console.log(groupData);

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
          <div className="h-40 w-40 bg-slate-200 rounded-full"></div>
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
