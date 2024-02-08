import React, { useEffect } from "react";
import useAuthProvider from "../hooks/useAuthProvider";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import UserSettings from "../components/userSettings";
import WentWrong from "../components/WentWrong";
import ProfileSkeleton from "../components/ProfileSkeleton";
import NavigateBack from "../components/NavigateBack";
import useChatProvider from "../hooks/useChatProvider";

const Profile = () => {
  const { userId } = useParams();
  const { user } = useAuthProvider();

  const { setIsSideChatOpen } = useChatProvider();

  useEffect(() => {
    setIsSideChatOpen(!userId);
  }, [userId, setIsSideChatOpen]);

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
    enabled: !!userId,
  });

  if (userDataError) {
    return <WentWrong refetch={userDataRefetch} />;
  }

  if (userDataLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="">
      <div className="flex justify-between items-center  py-2 px-4">
        <NavigateBack />
        <div className="w-fit">
          {user?._id === userData?._id && <UserSettings />}
        </div>
      </div>
      <div className="flex flex-col items-center">
        <div className="h-40 w-40">
          <img
            className="h-full w-full object-cover rounded-full"
            src={userData?.pic}
            alt={`Profile image of ${userData?.name}`}
          />
        </div>
        <div className="mt-4 text-center">
          <h1 className="text-3xl font-semibold">{userData?.name}</h1>
          <h3 className="text-xl">{userData?.bio} ksadf sad flsadf</h3>
        </div>
      </div>
    </div>
  );
};

export default Profile;