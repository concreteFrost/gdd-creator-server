import { Request, Response } from "express";
import UserModel, { UserAttributes } from "../models/userModel";
import { v4 as uuidv4 } from "uuid"; // Corrected import alias
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { CustomRequest } from "../types/types";
import { handleErrorResponse } from "../utils/handleErrorResponse";
import transporter from "../mail/mail";

export const register = async (req: Request, res: Response) => {
  const { username, email, password_hash } = req.body;
  try {
    //проверяем есть ли пользователь с таким email в базе данных
    const isUserRegistered = await UserModel.findOne({
      where: { email: email },
    });

    if (isUserRegistered) {
      res.status(403).json({
        success: false,
        message: "user with this email is already registered",
      });
      return;
    }

    //генерируем набор случайных символов
    const salt = await bcrypt.genSalt();

    //генерируем хэш пароля
    const hash: string = await bcrypt.hash(password_hash, salt);

    const user: UserAttributes = {
      id: uuidv4(), // Corrected variable name
      username,
      email,
      password_hash: hash,
      created_at: new Date(),
    };

    const newUser = await UserModel.create(user);

    //генерируем токен чтобы после регистрации пользователю не нужно было повторно логиниться
    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "60d",
      }
    );

    // Respond with the created user or a success message
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        username: user.username,
        email: user.email,
      },
      token: token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create user",
      error: error.message,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  const payload = {
    email: req.body.email,
    password: req.body.password,
  };
  try {
    const user = await UserModel.findOne({ where: { email: payload.email } });

    if (!user) {
      res.status(404).json({ success: false, message: "user not found" });
      return;
    }

    //сравниваем хешированые пароли
    const isValidPassword = await bcrypt.compare(
      payload.password,
      user.password_hash
    );

    if (!isValidPassword) {
      res
        .status(404)
        .json({ success: false, message: "password is incorrect" });
      return;
    }

    //генерируем токен для защищенных адресов
    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "60d",
      }
    );

    // const mailOptions = {
    //   from: process.env.EMAIL_USER,
    //   to: "concreteager@gmail.com",
    //   subject: "Reset your password",
    //   text: `Click the link to reset your password: `,
    //   html: `<p>Click the link to reset your password: <a href="">Reset Password</a></p>`,
    // };

    // await transporter.sendMail(mailOptions);

    res.status(201).json({
      success: true,
      token: token,
      user: {
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to login",
      error: error.message,
    });
  }
};

export const checkToken = async (req: Request, res: Response) => {
  try {
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};

export const changePassword = async (req: CustomRequest, res: Response) => {
  const { id } = req.user;
  const { old_password, new_password } = req.body;

  try {
    const existingUser = await UserModel.findByPk(id);

    if (!existingUser) {
      res.status(404).json({ success: false, message: "user not found" });
      return;
    }

    const isMatch = await bcrypt.compare(
      old_password,
      existingUser.password_hash
    );

    if (!isMatch) {
      res
        .status(403)
        .json({ success: false, message: "Incorrect old password" });
      return;
    }

    //генерируем набор случайных символов
    const salt = await bcrypt.genSalt();

    //генерируем хэш пароля
    const hash: string = await bcrypt.hash(new_password, salt);

    existingUser.password_hash = hash;

    await existingUser.save();

    res
      .status(201)
      .json({ success: true, message: "password has been updated" });
  } catch (error) {
    handleErrorResponse(res, error);
  }
};
