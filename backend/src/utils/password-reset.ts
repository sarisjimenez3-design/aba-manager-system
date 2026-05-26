import crypto from "crypto";

export const generateResetToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

export const getResetTokenExpiration = () => {
  const minutes = Number(process.env.RESET_TOKEN_EXPIRES_MINUTES || 15);

  const expirationDate = new Date();
  expirationDate.setMinutes(expirationDate.getMinutes() + minutes);

  return expirationDate;
};