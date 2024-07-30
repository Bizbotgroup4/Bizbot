import jwt from "jsonwebtoken";
export const generateToken = (_id: string) => {
  const payload = {
    _id,
    iat: Math.floor(Date.now() / 1000) - 30,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 60 * 24,
  };
  try {
    const token = jwt.sign(payload, process.env.SECRET_KEY ?? "");
    return token;
  } catch (err) {
    return false;
  }
};
