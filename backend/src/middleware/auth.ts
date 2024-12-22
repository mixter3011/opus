import { UUID } from "crypto";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";


dotenv.config();

const secret = process.env.SECRET_KEY;

if (!secret) {
  throw new Error("SECRET_KEY is not identified");
}

export interface AuthRequest extends Request {
  user?: UUID;
  token?: string;
}

export const auth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("user-auth-token");

    if (!token) {
      res.status(401).json({ msg: "No auth token, access denied!" });
      return;
    }

    const verified = jwt.verify(token, secret);

    if (!verified) {
      res.status(401).json({msg: "Token Verification failed!"});
      return;
    }

    const verifiedToken = verified as { id: UUID };

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, verifiedToken.id));

    if (!user) {
      res.status(401).json({msg: "User not found!"});
      return;
    }

    req.user = verifiedToken.id;
    req.token = token;

    next();
  } catch (e) {
    res.status(500).json(false);
  }
};
