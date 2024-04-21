import useCloseMenu from "../hooks/useCloseMenu";
import useAuthProvider from "../hooks/useAuthProvider";
import {
  PencilSquareIcon,
  PhotoIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

const ProfilePhoto = ({
  placedIn,
  userId,
  profilePhotoURL = "https://i.ibb.co/Twp960D/default-profile-400x400.png",
  handleProfilePhotoChange,
  removeProfilePhoto,
  photoUploading,
}) => {
  const { user } = useAuthProvider();

  const { isMenuOpen: uploaderOpen, setIsMenuOpen: setUploaderOpen } =
    useCloseMenu("photoUploader");

  return (
    <div className="relative ">
      <div className="  h-36 w-36 rounded-full">
        <img
          className=" w-full h-full object-cover rounded-full"
          src={profilePhotoURL}
          alt=""
        />
      </div>

      {/*  image upload button */}

      {placedIn === "userProfile" && user?._id === userId && (
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
                    onChange={(e) => {
                      handleProfilePhotoChange(e);
                      setUploaderOpen(false);
                    }}
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
      )}

      {photoUploading ? (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <span className="loading loading-spinner  w-12 text-white"></span>
        </div>
      ) : null}
    </div>
  );
};

export default ProfilePhoto;
