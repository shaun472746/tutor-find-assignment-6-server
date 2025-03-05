import jwt from "jsonwebtoken";

export const createToken = (
  jwtPayload: { userEmail: string; role: string; userId: string },
  secret: jwt.Secret | jwt.PrivateKey,
  expiresIn: string
) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn,
  } as jwt.SignOptions);
};