import { Router, Request } from "express";
import { db } from "../db";
import { NewUser, users } from "../db/schema";
import { eq, is } from "drizzle-orm";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

const authRouter = Router();
dotenv.config();

const secret = process.env.SECRET_KEY;

if (!secret) {
  throw new Error("SECRET_KEY is not identified");
}
interface SignUpBody {
  name: string;
  email: string;
  password: string;
}

interface LoginBody {
    email: string;
    password: string;
}

authRouter.post("/signup", async (req: Request<{}, {}, SignUpBody>, res) => {
  try {
    const { name, email, password } = req.body;

    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existingUser) {
      res.status(400).json({ msg: "User with same email already exists!" });
      return;
    }

    const hashedPassword = await bcryptjs.hash(password, 8);

    const newUser: NewUser = {
      name,
      email,
      password: hashedPassword,
    };

    const [user] = await db.insert(users).values(newUser).returning();
    res.status(201).json(user);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

authRouter.post("/login", async (req: Request<{}, {}, LoginBody>, res) => {
    try {
      const { email, password } = req.body;
  
      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.email, email));
  
      if (!existingUser) {
        res.status(400).json({ msg: "User with this email doesn't exist!" });
        return;
      }
  
      const isMatch = await bcryptjs.compare(password, existingUser.password);
      if (!isMatch) {
        res.status(400).json({ msg: "Incorrect password!" });
        return;
      }
      
      const token = jwt.sign({id: existingUser.id}, secret!,)

      res.json({token, ...existingUser});
    } catch (e) {
      res.status(500).json({ error: e });
    }
});

authRouter.post("/tokenIsvalid", async (req, res) => {
  try {
    const token = req.header("user-auth-token");

    if (!token) {
      res.json(false);
      return;
    }

    const verified = jwt.verify(token, secret);

    if (!verified) {
      res.json(false);
      return;
    }

    const verifiedToken = verified as { id: string };

    const [user] = await db.select().from(users).where(eq(users.id, verifiedToken.id));

    if (!user) {
      res.json(false)
      return;
    }

    res.json(true);
  } catch (e) {
    res.status(500).json(false);  
  }
});

authRouter.get("/", (req, res) => {
  res.send("Hey there ! from auth");
});

export default authRouter;
