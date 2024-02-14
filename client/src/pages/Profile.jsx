import React, { useEffect, useState } from "react";
import useAuthProvider from "../hooks/useAuthProvider";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import WentWrong from "../components/WentWrong";
import ProfileSkeleton from "../components/ProfileSkeleton";
import NavigateBack from "../components/NavigateBack";
import Settings from "../components/Settings";
import ProfilePhoto from "../components/ProfilePhoto";

const Profile = () => {
  const { userId } = useParams();
  const { user } = useAuthProvider();

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
    enabled: !!userId,
  });
  console.log(profilePhotoURL);

  if (userDataError) {
    return <WentWrong refetch={userDataRefetch} />;
  }

  if (userDataLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="">
      <div className="flex justify-between items-center  py-2 px-2 lg:px-4">
        <NavigateBack />
        <div className="w-fit">
          {user?._id === userData?._id && (
            <Settings placedIn={"profile"} userRefetch={userDataRefetch} />
          )}
        </div>
      </div>
      <div className="flex flex-col items-center">
        <div className="">
          <ProfilePhoto
            placedIn={"userProfile"}
            userId={userData?._id}
            profilePhotoURL={profilePhotoURL}
            photoUploading={photoUploading}
          />
        </div>
        <div className="mt-4 text-center">
          <h1 className="text-3xl font-semibold">{userData?.name}</h1>
          <h3 className="text-xl">{userData?.bio}</h3>
        </div>
      </div>
    </div>
  );
};

export default Profile;
