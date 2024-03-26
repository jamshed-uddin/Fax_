import { useState } from "react";
import {
  ArrowLeftStartOnRectangleIcon,
  Cog6ToothIcon,
  EllipsisVerticalIcon,
  PencilSquareIcon,
  TrashIcon,
  UserGroupIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import useAuthProvider from "../hooks/useAuthProvider";
import useCloseMenu from "../hooks/useCloseMenu";
import Modal from "./Modal";
import useTheme from "../hooks/useTheme";
const Settings = ({ placedIn, settingsFor, chatInfo, userRefetch }) => {
  const { dark } = useTheme();
  const { userLogout } = useAuthProvider();
  const { user } = useAuthProvider();
  const navigate = useNavigate();
  const [modalFor, setModalFor] = useState("");
  const [openModalForEdit, setOpenModalForEdit] = useState(false);
  const userLogoutHandler = () => {
    userLogout();
    navigate("/");
  };

  const { isMenuOpen, setIsMenuOpen } = useCloseMenu("settings");

  const { isMenuOpen: isModalOpen, setIsMenuOpen: setIsModalOpen } =
    useCloseMenu("modal");

  return (
    <>
      <div id="modal">
        <Modal
          modalFor={modalFor}
          isModalOpen={
            modalFor === "editProfile" ? openModalForEdit : isModalOpen
          }
          setIsModalOpen={
            modalFor === "editProfile" ? setOpenModalForEdit : setIsModalOpen
          }
          chat={chatInfo}
          userId={user?._id}
          userRefetch={userRefetch}
        />
      </div>
      <div id="settings" className="relative select-none">
        <div
          onClick={() => setIsMenuOpen((p) => !p)}
          className={`cursor-pointer transition-transform duration-500 active:scale-90 pl-3`}
        >
          {placedIn === "profile" ? (
            <Cog6ToothIcon className="h-7 w-7 " />
          ) : (
            <EllipsisVerticalIcon className="h-7 w-7 " />
          )}
        </div>
        <div
          className={`absolute w-max top-8 right-0  py-2 px-3  shadow-md rounded-xl z-30  ${
            isMenuOpen ? " block h-max " : " hidden "
          } ${dark ? "bg-slate-800 shadow-slate-700" : "bg-white"}`}
        >
          {/* settings for profile */}
          {placedIn === "profile" ? (
            <ul className="text-lg  space-y-1">
              <li
                onClick={() => {
                  setModalFor("editProfile");
                  // setIsModalOpen(true);
                  setIsMenuOpen(false);
                  setOpenModalForEdit(true);
                }}
                className=" px-3 py-1 rounded-xl flex items-center gap-1 cursor-pointer"
              >
                <PencilSquareIcon className="w-5 h-5 " />
                <span>Edit profile</span>
              </li>

              <li
                onClick={userLogoutHandler}
                className=" px-3 py-1 rounded-xl flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeftStartOnRectangleIcon className="w-5 h-5 inline" />
                Logout
              </li>
            </ul>
          ) : settingsFor === "otherUser" ? (
            <ul className="text-lg  space-y-1">
              <Link
                to={`/profile/${
                  chatInfo?.users[0]._id === user?._id
                    ? chatInfo?.users[1]._id
                    : chatInfo?.users[0]._id
                }`}
              >
                <li
                  onClick={() => setIsMenuOpen(false)}
                  className=" px-3 py-1 rounded-xl flex items-center gap-1"
                >
                  <UserIcon className="w-5 h-5 " />
                  <span>Profile</span>
                </li>
              </Link>

              <li
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsModalOpen(true);
                  setModalFor("deleteChat");
                }}
                className=" px-3 py-1 rounded-xl flex items-center gap-1 cursor-pointer"
              >
                <TrashIcon className="w-5 h-5 inline" /> Delete conversation
              </li>
            </ul>
          ) : (
            <ul className="text-lg  space-y-1">
              <Link
                to={`/profile/${chatInfo?._id}`}
                state={{ profileOf: "group" }}
              >
                {
                  <li
                    onClick={() => setIsMenuOpen(false)}
                    className=" px-3 py-1 rounded-xl flex items-center gap-1"
                  >
                    <UserGroupIcon className="w-5 h-5 " />
                    <span>Group info</span>
                  </li>
                }
              </Link>

              <li
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsModalOpen(true);
                  setModalFor("leaveGroup");
                }}
                className=" px-3 py-1 rounded-xl flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeftStartOnRectangleIcon className="w-5 h-5 inline" />
                Leave group
              </li>
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default Settings;
