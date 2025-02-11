import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({ message: "User created successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "[USER_REGISTER]: Internal Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await prisma.user.findUnique({
        where: {
            username,
        },
    });

    if(!user) {
        return res.status(404).json({ message: "User not found!" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid) {
        return res.status(401).json({ message: "Passord is not match" });
    }

    const age = 1000 * 60 * 60 * 24 * 7;

    const token = jwt.sign({
        sub: user.id,
    }, 
        process.env.JWT_SERCET_KEY,
        { expiresIn: age },
    );

    const { password: userPassword, updatedAt, createdAt, chatIds, id, ...infoUser } = user;

    const [ headers, payload, signature ] = token.split(".");
    const tokenData = `${headers}.${payload}`;

    res.cookie("signature", signature, {
        httpOnly: true,
        // recure: true,
        maxAge: age,
    }).status(200).json({ tokenData, infoUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "[USER_LOGIN]: Internal Error" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("signature").status(200).json({ message: "Logout Successfull!!!" });
};
