import User from "../models/User.js";

export const myProfile = async (req, res) => {
  const { username } = req.user;

  try {
    const userData = await User.findOne({ username });

    if (!userData) {
      throw {
        status: 404,
        message: "User is not found",
      };
    }

    const { profileImage, displayName, bio } = userData;

    console.log(profileImage, displayName, bio);

    res.status(200).json({
      message: "User found successfully",
      user: { username, profileImage, displayName, bio },
      edit: userData.username === req.user.username,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const userProfile = async (req, res) => {
  const { username } = req.params;

  try {
    const userData = await User.findOne({ username });

    if (!userData) {
      throw {
        status: 404,
        message: "User is not found",
      };
    }

    const { profileImage, displayName, bio, stats } = userData;

    res.status(200).json({
      message: "User found successfully",
      user: { username, profileImage, displayName, bio, stats },
      edit: userData.username === req.user.username,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
