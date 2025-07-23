import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import ImagePicker from "../components/ImagePicker";
import ProfileIconImg from "../assets/images/profile-icon.png";
import { settings, updateProfile } from "../util/http";
import Input from "../ui/Input";
import Button from "../ui/Button";
import TextArea from "../ui/TextArea";
import { useEffect } from "react";

const SettingsPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, status } = useQuery({
    queryKey: ["settings"],
    queryFn: ({ signal }) => settings(signal),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const { mutate, status: mutationStatus } = useMutation({
    mutationFn: updateProfile,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["settings"] });
      navigate("/profile/toghrul");
    },
    onError: (error) => {
      console.error(error.message);
    },
  });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    // const userData = Object.fromEntries(data.entries());
    console.log(data);

    mutate(data);
  };

  if (status === "pending") {
    return <p>Loading...</p>;
  }

  if (status === "error") {
    return <h1>Error occurred</h1>;
  }

  const { user } = data;

  return (
    <div className="my-12 flex flex-col justify-center items-center">
      <form
        method="POST"
        onSubmit={handleUpdateProfile}
        className="flex flex-col items-center w-full max-w-100"
        encType="multipart/form-data"
      >
        <ImagePicker image={user.profileImage || ProfileIconImg} />
        <Input
          type="text"
          id="displayName"
          name="displayName"
          placeholder="Display Name"
          defaultValue={user.displayName || ""}
        />
        <Input
          type="text"
          id="username"
          name="username"
          placeholder="Username"
          defaultValue={user.username || ""}
        />
        <Input
          type="email"
          id="email"
          name="email"
          placeholder="Email"
          defaultValue={user.email || ""}
        />
        {/* <Input
          type="password"
          id="password"
          name="password"
          placeholder="Password"
        />
        <Input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          placeholder="Confirm Password"
          defaultValue={user.displayName || ""}
        /> */}
        <TextArea
          id="bio"
          name="bio"
          placeholder="Bio"
          defaultValue={user.bio || "I have yet to fill in my bio."}
        />
        <Button className="mt-5 w-full" disabled={status === "pending"}>
          {mutationStatus === "pending"
            ? "Updating profile..."
            : "Update profile"}
        </Button>
      </form>
    </div>
  );
};

export default SettingsPage;
