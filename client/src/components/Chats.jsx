import ChatCard from "./ChatCard";
import { Link } from "react-router-dom";

const Chats = ({ chats, placedIn }) => {
  return (
    <div className="mb-3">
      <div className="space-y-2">
        {chats?.map((chat, index) => (
          <div key={index}>
            <Link to={`inbox/${chat?._id}`}>
              <ChatCard key={chat._id} chat={chat} placedIn={placedIn} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chats;
