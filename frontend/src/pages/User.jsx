import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

import { userProfile } from "../util/http";
import ProfileIconImg from "../assets/images/profile-icon.png";
import Button from "../ui/Button";

const UserPage = () => {
  const navigate = useNavigate();
  const { username } = useParams();

  const { data, status } = useQuery({
    queryKey: ["user-profile", username],
    queryFn: ({ signal, queryKey }) => userProfile(signal, queryKey[1]),
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  if (status === "pending") {
    return <p>Loading...</p>;
  }

  if (status === "error") {
    return <h1>Error occurred</h1>;
  }

  const { user, edit } = data;

  return (
    <div className="text-white mt-10 flex justify-between gap-10 max-md:flex-col max-custom:gap-2">
      <div className="flex gap-10 max-custom:flex-col max-custom:gap-5 max-custom:items-center">
        <div className="flex flex-col items-center w-45">
          <div className="size-40 rounded-full overflow-hidden border-3 border-header-outline">
            <img
              src={user.profileImage || ProfileIconImg}
              alt="profile-icon"
              className="w-full h-full object-cover"
            />
          </div>
          {edit && (
            <Button className="mt-3" onClick={() => navigate("/settings")}>
              Edit profile
            </Button>
          )}
        </div>

        <div className="max-custom:text-center">
          <h1 className="text-4xl">{user.displayName || user.username}</h1>
          <p className="text-lg text-gray-text">@{user.username}</p>
          <div className="flex gap-4 mt-6 max-custom:justify-center">
            <p className="text-gray-text w-16">
              <span className="text-3xl font-bold text-white">
                {user.stats.wins}
              </span>{" "}
              wins
            </p>
            <p className="text-gray-text w-16">
              <span className="text-3xl font-bold text-white">
                {user.stats.ties}
              </span>{" "}
              ties
            </p>
            <p className="text-gray-text w-16">
              <span className="text-3xl font-bold text-white">
                {user.stats.losses}
              </span>{" "}
              losses
            </p>
          </div>
        </div>
      </div>

      <div>
        <p className="text-gray-text max-md:my-7">
          {user.bio ||
            "I have yet to fill my bio.I have yet to fill my bio.I have yet to fill my bio.I have yet to fill my bio.I have yet to fill my bio."}
        </p>
      </div>
    </div>
  );
};

export default UserPage;
