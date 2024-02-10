import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const InboxScrollDown = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // if (allMessages?.at(-1)?.sender._id === user?._id) return;
    const messageInbox = document.getElementById("message-container");

    if (messageInbox) {
      messageInbox.scrollTop = messageInbox?.scrollHeight;
    }
  }, [pathname]);
  return null;
};

export default InboxScrollDown;
