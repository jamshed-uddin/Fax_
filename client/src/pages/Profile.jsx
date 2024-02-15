import { useState } from "react";
import useAuthProvider from "../hooks/useAuthProvider";
import { Link, useLocation, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import WentWrong from "../components/WentWrong";
import ProfileSkeleton from "../components/ProfileSkeleton";
import NavigateBack from "../components/NavigateBack";
import Settings from "../components/Settings";
import ProfilePhoto from "../components/ProfilePhoto";
import useGetChat from "../hooks/useGetChat";
import UserCard from "../components/UserCard";
import {
  ArrowLeftStartOnRectangleIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Modal from "../components/Modal";

const Profile = () => {
  const { userId } = useParams();
  const { user } = useAuthProvider();
  const { state } = useLocation();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState("");
  console.log(state?.profileOf);

  const [profilePhotoURL, setProfilePhotoURL] = useState("");
  const [photoUploading, setPhotoUploading] = useState(false);

  const {
    data: userData,
    isLoading: userDataLoading,
    error: userDataError,
    refetch: userDataRefetch,
  } = useQuery({
    queryKey: [userId],
    queryFn: async () => {
      try {
        const result = await axios.get(`/api/user/singleUser?userId=${userId}`);
        setProfilePhotoURL(result?.data.photoURL);
        return result.data;
      } catch (error) {
        if (
          error.response &&
          (error.response.status === 400 || error.response.status === 401)
        ) {
          throw new Error(error.response.data.message);
        } else {
          throw new Error("Something went wrong");
        }
      }
    },
    enabled: !!userId && state?.profileOf !== "group",
  });

  const {
    data: singleChat,
    isLoading: singleChatLoading,
    error: singleChatError,
    refetch: singleChatRefetch,
  } = useGetChat(`/api/chat/${userId}`, !!state?.profileOf);
  //userId here is chatId.which comes with params when user navigate here in profile by clicking on group chat.
  console.log(singleChat);
  if (userDataError || singleChatError) {
    return (
      <WentWrong
        refetch={state?.profileOf ? singleChatRefetch : userDataRefetch}
      />
    );
  }

  if (userDataLoading || singleChatLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="">
      <Modal
        isModalOpen={modalOpen}
        modalFor={modalAction}
        setIsModalOpen={setModalOpen}
        chat={singleChat}
      />

      <div className="flex justify-between items-center  py-2 px-2 lg:px-4">
        <NavigateBack />
        {state && (
          <div>
            <Link
              to={`/editGroup/${singleChat?._id}`}
              className="w-fit rounded  cursor-pointer active:scale-95 flex  "
            >
              <PencilSquareIcon className="w-6 h-6" /> <span>Edit</span>
            </Link>
          </div>
        )}
        {!state && (
          <div className="w-fit">
            {user?._id === userData?._id && (
              <Settings placedIn={"profile"} userRefetch={userDataRefetch} />
            )}
          </div>
        )}
      </div>
      <div className="flex flex-col items-center">
        <div className="">
          <ProfilePhoto
            placedIn={"userProfile"}
            userId={userData?._id}
            profilePhotoURL={profilePhotoURL || singleChat?.chatPhotoURL}
            photoUploading={photoUploading}
          />
        </div>
        <div className="mt-4 text-center">
          <h1 className="text-3xl font-semibold">
            {singleChat && state?.profileOf
              ? singleChat?.chatName
              : userData?.name}
          </h1>
          <h3 className="text-xl">
            {singleChat && state?.profileOf
              ? singleChat?.chatDescription
              : userData?.bio}
          </h3>
        </div>
      </div>
      {state && (
        <div className="px-2 lg:px-4 mt-4">
          <h1 className="text-xl font-semibold mb-2">Members</h1>
          <div>
            {singleChat?.users.map((user) => (
              <div key={user?._id} className="flex gap-3 w-fit ">
                <UserCard user={user} />
                {singleChat?.groupAdmin?._id === user?._id && (
                  <div className="text-sm text-green-500">Admin</div>
                )}
              </div>
            ))}
            <div className="mt-6 flex flex-col items-start gap-2">
              <button
                onClick={() => {
                  setModalAction("leaveGroup");
                  setModalOpen(true);
                }}
                className="text-red-500 text-lg"
              >
                <ArrowLeftStartOnRectangleIcon className="w-5 h-5 inline mr-1" />
                Leave group
              </button>
              {singleChat?.groupAdmin.map((a) => a._id).includes(user?._id) && (
                <button
                  onClick={() => {
                    setModalAction("deleteChat");
                    setModalOpen(true);
                  }}
                  className="text-red-500 text-lg"
                >
                  <TrashIcon className="w-5 h-5 inline mr-1" />
                  Delete group
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
