export const isAlreadyAuth = (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  try {
    // I was just lazy
    if (accessToken || refreshToken) {
      throw {
        status: 409,
        message: "Already logged in",
      };
    }

    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
};
