export const online = (req, res, next) => {
  res.status(200).json({ message: "Online" });
};
