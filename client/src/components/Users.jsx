import UserCard from "./UserCard";
import axios from "axios";

const Users = ({ users }) => {
  const handleAccessChat = async (userId) => {
    try {
      const result = await axios.post(`/api/chat/accessChat`, {
        userId,
      });
      console.log(result);
      if (result) {
        console.log(result.data);
        // navigate(`inbox/${result.data._id}`);
      }
    } catch (error) {
      console.log(error);
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
      <h1 className="text-2xl font-semibold mb-2">Users</h1>
      <div className="space-y-2">
        {users?.map((user) => (
          <UserCard key={user._id} user={user} clickFunc={handleAccessChat} />
        ))}
      </div>
    </div>
  );
};

export default Users;
