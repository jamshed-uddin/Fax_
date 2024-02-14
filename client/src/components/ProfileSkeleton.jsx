import NavigateBack from "./NavigateBack";
import useTheme from "../hooks/useTheme";

const ProfileSkeleton = () => {
  const { dark } = useTheme();

  const themeWiseBg = `${dark ? "bg-slate-800" : "bg-slate-200"}`;

  return (
    <>
      <div className="px-2 lg:px-4 mt-3">
        <NavigateBack />
      </div>
      <div className=" flex justify-center mt-12  ">
        <div className="  ">
          <div
            className={`skeleton ${themeWiseBg} h-40 w-40 rounded-full shrink-0`}
          ></div>
          <div className=" mt-4 gap-2 flex flex-col items-center">
            <div className={`skeleton h-6 w-full ${themeWiseBg}`}></div>
            <div className={`skeleton h-4 w-28 ${themeWiseBg}`}></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileSkeleton;
