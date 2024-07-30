import bcrypt from "bcryptjs";

export const comparePassword = async (
  password: string,
  enteredPassword: string
) => {
  const valid = await bcrypt.compare(password, enteredPassword);
  if (valid) {
    return true;
  }
  return false;
};
