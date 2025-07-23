import User from "../models/User.js";
import { uploadImage } from "../util/cloudinary.js";

export const settings = async (req, res) => {
  const { username } = req.user;

  try {
    const userData = await User.findOne({ username });

    if (!userData) {
      throw {
        status: 404,
        message: "User is not found",
      };
    }

    const { email, profileImage, displayName, bio } = userData;

    console.log(email, profileImage, displayName, bio);

    res.status(200).json({
      message: "User found successfully",
      user: { email, username, profileImage, displayName, bio },
      edit: userData.username === req.user.username,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const updateProfile = async (req, res) => {
  const { _id } = req.user;
  const { displayName, username, bio } = { ...req.body };

  let url;

  try {
  const profileImage = req.file;

    if (req.file) {
      url = await uploadImage(profileImage);
      console.log(url);
    }

    const user = await User.findOne({ _id });

    if (!user) {
      throw {
        status: 404,
        message: "User is not found",
      };
    }

    if (url) {
      user.profileImage = url;
    }
    user.displayName = displayName;
    user.username = username;
    user.bio = bio;
    await user.save();

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
