const isOwnMessage = (sender, userId) => {
  return sender?._id === userId;
};

const isUsersLastMessage = (messages, index, message, position = "last") => {
  return (
    message?.sender?._id !==
    messages?.at(position === "last" ? index + 1 : index - 1)?.sender?._id
  );
};

const chatPhotoHandler = (singleChat, user) => {
  if (singleChat?.isGroupChat) return singleChat?.chatPhotoURL;

  return singleChat?.users[0]?._id === user?._id
    ? singleChat?.users[1]?.photoURL
    : singleChat?.users[0]?.photoURL;
};

const chatNameHandler = (singleChat, user) => {
  if (singleChat?.isGroupChat) return singleChat?.chatName;

  return singleChat?.users[0]._id === user?._id
    ? singleChat?.users[1].name
    : singleChat?.users[0].name;
};

const messageTime = (messageDate) => {
  const time = new Date(messageDate);

  const clockTime = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return clockTime.startsWith("0") ? clockTime.slice(1) : clockTime;
};

const isSameDay = (currentDate, messageDate) => {
  return (
    currentDate.getFullYear() === messageDate.getFullYear() &&
    currentDate.getMonth() === messageDate.getMonth() &&
    currentDate.getDate() === messageDate.getDate()
  );
};
const isYesterday = (currentDate, messageDate) => {
  return (
    currentDate.getFullYear() === messageDate.getFullYear() &&
    currentDate.getMonth() === messageDate.getMonth() &&
    currentDate.getDate() === messageDate.getDate() + 1
  );
};

const chatDate = (messageDateRaw) => {
  const messageDate = new Date(messageDateRaw);
  const currentDate = new Date();

  const msDifference = currentDate - new Date(messageDate);

  const day = 60 * 60 * 24 * 1000;
  const days = Math.floor(msDifference / day);

  const clockTime = messageDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  if (isSameDay(currentDate, messageDate)) {
    return clockTime.startsWith("0") ? clockTime.slice(1) : clockTime;
  } else if (isYesterday(currentDate, messageDate)) {
    return "YesterDay";
  } else {
    return messageDate.toLocaleDateString("en-IN", {
      day: "numeric",
      year: "numeric",
      month: "short",
    });
  }
};

const messageDate = (date) => {
  const dayInMs = 60 * 60 * 24 * 1000;

  const msDifference = new Date() - new Date(date);

  const days = Math.floor(msDifference / dayInMs);

  if (days < 1) return "Today";

  return chatDate(date);
};

export {
  isOwnMessage,
  isUsersLastMessage,
  chatPhotoHandler,
  chatNameHandler,
  messageTime,
  chatDate,
  messageDate,
};
