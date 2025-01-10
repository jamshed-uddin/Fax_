import { useNavigate } from "react-router-dom";
import UserCard from "./UserCard";
import axios from "axios";

const Users = ({ users, title = true }) => {
  const navigate = useNavigate();
  const handleAccessChat = async (userId) => {
    try {
      const result = await axios.post(`/api/chat/accessChat`, {
        userId,
      });

      if (result) {
        navigate(`inbox/${result.data._id}`);
      }
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
  };

  return (
    <div>
      {title && <h1 className="text-xl font-semibold mb-2">Users</h1>}
      <div className="space-y-2">
        {users?.map((user) => (
          <UserCard key={user._id} user={user} clickFunc={handleAccessChat} />
        ))}
      </div>
    </div>
  );
};

export default Users;
