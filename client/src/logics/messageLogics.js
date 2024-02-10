const isOwnMessage = (sender, userId) => {
  return sender?._id === userId;
};

const isUsersLastMessage = (messages, index, message) => {
  return message?.sender?._id === messages[index + 1]?.sender?._id;
};

const chatPhotoHandler = (singleChat, user) => {
  return singleChat?.users[0]._id === user?._id
    ? singleChat?.users[1].photoURL
    : singleChat?.users[0].photoURL;
};

const chatNameHandler = (singleChat, user) => {
  return singleChat?.users[0]._id === user?._id
    ? singleChat?.users[1].name
    : singleChat?.users[0].name;
};

const lastSeen = (currentTime, previousTime) => {
  const msDifference = currentTime - previousTime;

  const minute = 60 * 1000;
  const hour = minute * 60;
  const day = hour * 24;
  const week = day * 7;
  const month = day * 30;

  //difference in time unit
  const minutes = Math.floor(msDifference / minute);
  const hours = Math.floor(msDifference / hour);
  const days = Math.floor(msDifference / day);
  const weeks = Math.floor(msDifference / week);
  const months = Math.floor(msDifference / month);

  // showing to time
  if (months > 0) {
    return (
      previousTime.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }) +
      " " +
      previousTime.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })
    );
  } else if (weeks > 0) {
    return weeks === 1 ? "1 Week ago" : `${weeks} weeks ago`;
  } else if (days > 0) {
    return days === 1 ? "1 day ago" : `${days} days ago`;
  } else if (hours > 0) {
    return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  } else if (minutes > 0) {
    return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
  } else {
    return "Just now";
  }
};

export {
  isOwnMessage,
  isUsersLastMessage,
  chatPhotoHandler,
  chatNameHandler,
  lastSeen,
};
