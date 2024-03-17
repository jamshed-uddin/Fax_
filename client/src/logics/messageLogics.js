const isOwnMessage = (sender, userId) => {
  return sender?._id === userId;
};

const isUsersLastMessage = (messages, index, message, position = "last") => {
  if (position === "first" && messages.at(index - 1)?.type === "event")
    return true;

  if (messages.at(index + 1)?.type === "event") return true;

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

const isSameDay = (messageDate) => {
  const currentDate = new Date();

  return (
    currentDate.getFullYear() === messageDate.getFullYear() &&
    currentDate.getMonth() === messageDate.getMonth() &&
    currentDate.getDate() === messageDate.getDate()
  );
};
const isYesterday = (messageDate) => {
  const currentDate = new Date();

  const yesterday =
    currentDate.getFullYear() === messageDate.getFullYear() &&
    currentDate.getMonth() === messageDate.getMonth() &&
    currentDate.getDate() - 1 === messageDate.getDate();
  console.log(yesterday);

  return yesterday;
};

const chatDate = (messageDateRaw) => {
  const messageDate = new Date(messageDateRaw);

  const clockTime = messageDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  if (isSameDay(messageDate)) {
    return clockTime.startsWith("0") ? clockTime.slice(1) : clockTime;
  } else if (isYesterday(messageDate)) {
    return "YesterDay";
  } else {
    return messageDate.toLocaleDateString("en-IN", {
      day: "numeric",
      year: "numeric",
      month: "short",
    });
  }
};

const messageDate = (rawDate) => {
  const date = new Date(rawDate);

  if (isSameDay(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";

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
