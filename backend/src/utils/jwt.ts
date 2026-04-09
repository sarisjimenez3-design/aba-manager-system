import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export const generateToken = (payload: JwtPayload): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET no está configurado");
  }

  return jwt.sign(payload, secret, {
    expiresIn: "7d",
  });
};

export const verifyToken = (token: string): JwtPayload => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET no está configurado");
  }

  return jwt.verify(token, secret) as JwtPayload;
};