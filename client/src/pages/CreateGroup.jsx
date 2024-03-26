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
import axios from "axios";
import useAuthProvider from "../hooks/useAuthProvider";
import { useNavigate, useParams } from "react-router-dom";

import ProfileSkeleton from "../components/ProfileSkeleton";
import WentWrong from "../components/WentWrong";
import useTheme from "../hooks/useTheme";
import useChatProvider from "../hooks/useChatProvider";
import ChatCard from "../components/ChatCard";
import useOnlineStatus from "../hooks/useOnlineStatus";
import useGetData from "../hooks/useGetData";

const CreateGroup = () => {
  const { dark } = useTheme();
  const { online } = useOnlineStatus();
  const navigate = useNavigate();
  const { myChats, myChatsLoading } = useChatProvider();
  const { groupId } = useParams();
  const [editMode, setEditMode] = useState(false);
  const { user: currentUser } = useAuthProvider();
  const [searchQuery, setSearchQuery] = useState("");
  const bouncedQuery = useDebounce(searchQuery, 600);
  const [photoUploading, setPhotoUploading] = useState("");
  const [profilePhotoURL, setProfilePhotoURL] = useState("");
  const [profilePhotoFile, setProfilePhotoFile] = useState();
  const [groupCreateLoading, setGroupCreateLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([currentUser]);
  const [groupData, setGroupData] = useState({
    chatName: "",
    chatDescription: "",
    chatPhotoURL: "",
    users: [],
  });

  const [error, setError] = useState("");

  // editing group section starts ----------

  const {
    data: singleChat,
    isLoading: singleChatLoading,
    error: singleChatError,
    refetch: singleChatRefetch,
  } = useGetData(`/api/chat/${groupId}`, !!groupId);

  useEffect(() => {
    if (!singleChat) return;
    setEditMode(true);

    const { chatName, chatDescription, chatPhotoURL, users } = singleChat;

    setProfilePhotoURL(singleChat?.chatPhotoURL);
    setSelectedUsers(users);
    setGroupData({
      chatName,
      chatDescription,
      chatPhotoURL,
    });
  }, [singleChat, currentUser]);
  // console.log(singleChat);
  // editing group section ends ----------

  const { data: searchResult, isLoading: searchLoading } =
    useGetSearchResult(bouncedQuery);

  const handleTextInput = (e) => {
    setError("");
    setGroupData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const selectOrRemoveUser = (selectedUser, action) => {
    console.log(selectedUser);
    if (action === "remove") {
      return setSelectedUsers((users) =>
        users.filter((user) => user._id !== selectedUser._id)
      );
    }

    if (
      selectedUsers.some((user) => user._id === selectedUser._id) ||
      currentUser._id === selectedUser._id
    )
      return;

    setSelectedUsers((users) => [...users, selectedUser]);
  };

  useEffect(() => {
    setGroupData((p) => ({
      ...p,
      users: selectedUsers.map((user) => user._id),
    }));
  }, [selectedUsers, currentUser]);

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
    setProfilePhotoFile(file);

    setUploaderOpen((p) => !p);
    // if (file) {
    //   try {
    //     setPhotoUploading(true);
    //     await uploadPhotoToCloud(file).then((res) => {
    //       console.log(res);
    //       const cloudImageUrl = res.data.secure_url;
    //       setPhotoUploading(false);
    //       setProfilePhotoURL(cloudImageUrl);
    //     });
    //   } catch (error) {
    //     setPhotoUploading(false);
    //   }
    // }
  };

  // create or  update group handler
  const handleCreateGroup = async () => {
    if (!groupData.chatName) {
      return setError("Group must have a name.");
    }
    if (groupData.users.length < 2) {
      return setError("At least 2 members required (including you)");
    }
    if (!online) return;

    setGroupCreateLoading(true);
    if (profilePhotoFile) {
      try {
        await uploadPhotoToCloud(profilePhotoFile).then((res) => {
          const cloudImageUrl = res.data.secure_url;
          setPhotoUploading(false);

          setGroupData((p) => ({ ...p, chatPhotoURL: cloudImageUrl }));
        });
      } catch (error) {
        setGroupData((p) => ({ ...p, chatPhotoURL: "" }));
      }
    }

    try {
      const result = editMode
        ? await axios.put(`/api/chat/group/${singleChat?._id}`, {
            ...groupData,
            groupAdmin: singleChat?.groupAdmin,
          })
        : await axios.post(`/api/chat/group`, groupData);

      navigate(`/inbox/${result?.data._id}`, { replace: true });

      setGroupCreateLoading(false);
    } catch (error) {
      console.log(error.response);
      setGroupCreateLoading(false);
    }
  };
  console.log(singleChat);

  const btnStyle = `btn btn-neutral btn-sm px-8 ${
    dark
      ? "bg-white text-gray-800 hover:bg-white hover:text-gray-800"
      : "text-white "
  }`;

  if (singleChatLoading) {
    return <ProfileSkeleton />;
  }

  if (singleChatError) {
    return <WentWrong refetch={singleChatRefetch} />;
  }

  return (
    <div className="overflow-y-auto h-full w-full pt-3 px-2 lg:px-4 pb-10">
      <div className=" flex items-center justify-between">
        <NavigateBack />
        <div>
          <button onClick={handleCreateGroup} className={btnStyle}>
            {groupCreateLoading
              ? editMode
                ? "Updating..."
                : "Creating..."
              : editMode
              ? "Update"
              : "Create"}
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
                    className={` flex gap-2 md:gap-5 rounded-lg px-1 py-1 md:px-3 shadow-md absolute bottom-2 lg:-right-28 -right-20 `}
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
            className="input text-lg border-0 border-b-[1px] border-slate-500 rounded-none focus:outline-0 focus:border-b-[1.3px] focus:border-0 w-full lg:w-1/2 focus:border-slate-900"
            name="chatName"
            value={groupData.chatName}
            onChange={handleTextInput}
            required
            disabled={
              editMode &&
              singleChat?.groupAdmin?.some(
                (user) => user._id !== currentUser?._id
              )
            }
          />
          {/* description */}
          <textarea
            name="chatDescription"
            placeholder="Description"
            className="textarea text-lg border-0 border-b-[1px] border-slate-500 rounded-none focus:outline-0 focus:border-b-[1.3px] focus:border-slate-900  w-full lg:w-1/2"
            value={groupData.chatDescription}
            onChange={handleTextInput}
            disabled={
              editMode &&
              singleChat?.groupAdmin?.some(
                (user) => user._id !== currentUser?._id
              )
            }
          ></textarea>
          {error && <span className="text-red-500 text-sm ml-1">{error}</span>}
        </div>
        {/* added members */}
        <div className="">
          <h1 className="text-2xl font-medium">Members</h1>
          <div className="overflow-x-auto mt-2 ">
            <div className=" border-red-100 pt-2 pb-1  flex items-center gap-3 flex-nowrap w-max">
              {selectedUsers.map(
                (user) =>
                  user._id !== currentUser?._id && (
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
                  )
              )}
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
          <div className="mt-3 flex justify-center ">
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
                searchResult?.users.map(
                  (user) =>
                    user._id !== currentUser?._id && (
                      <div
                        onClick={() => selectOrRemoveUser(user)}
                        key={user?._id}
                        className={`shadow-md rounded-xl px-2 py-1 relative`}
                      >
                        <UserCard user={user} />
                        <div className="absolute -top-1 lg:-right-1 right-0 shadow-md rounded-full">
                          {selectedUsers.some(
                            (selectedUser) => selectedUser._id === user._id
                          ) && (
                            <CheckIcon className="w-5 h-5 rounded-full bg-green-400 p-1 text-white" />
                          )}
                        </div>
                      </div>
                    )
                )
              )}
            </div>
          </div>
        </div>
        {/* existing chat */}
        {!!myChats?.length && (
          <div className="space-y-3">
            <h1 className="text-xl font-semibold mb-2">Chats</h1>
            {myChatsLoading ? (
              <CardSkeleton cardAmount={2} />
            ) : (
              myChats?.map(
                (chat) =>
                  !chat.isGroupChat && (
                    <div
                      className={`shadow-md rounded-xl px-2 py-1 relative cursor-pointer`}
                      onClick={() =>
                        selectOrRemoveUser(
                          chat.users.find((u) => u._id !== currentUser?._id)
                        )
                      }
                      key={chat._id}
                    >
                      <ChatCard chat={chat} />

                      <div className="absolute -top-1 lg:-right-1 right-0 shadow-md rounded-full">
                        {selectedUsers.some(
                          (selectedUser) =>
                            selectedUser._id ===
                            chat.users.find(
                              (user) => user._id !== currentUser?._id
                            )._id
                        ) && (
                          <CheckIcon className="w-5 h-5 rounded-full bg-green-400 p-1 text-white" />
                        )}
                      </div>
                    </div>
                  )
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateGroup;
