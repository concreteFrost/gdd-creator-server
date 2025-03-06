import { Request, Response } from "express";
import UserModel, { UserAttributes } from "../models/userModel";
import { v4 as uuidv4 } from "uuid"; // Corrected import alias
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { CustomRequest } from "../types/types";
import { handleErrorResponse } from "../utils/handleErrorResponse";
import transporter from "../mail/mail";
import { json } from "sequelize";
import GDDModel from "../models/gddModel";
import LocationModel from "../models/locationModel";
import CharacterModel from "../models/characterModel";
import { deleteFile } from "../utils/fileHandlers";

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

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "New user registered",
      text: `${username} successfully registered.
      email: ${email}`,
    });

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

export const resetPassword = async (req: CustomRequest, res: Response) => {
  const { token, password } = req.body;

  if (!token) {
    res.status(400).json({ success: false, message: "token was not provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const user = await UserModel.findOne({ where: { email: decoded.email } });

    if (!user) {
      res.status(400), json({ success: false, message: "user not found" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password_hash = hashedPassword;
    await user.save();

    res.json({ success: true, message: "Password successfully reset" });
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

export const forgotPassword = async (req: CustomRequest, res: Response) => {
  const { email } = req.body;

  try {
    const isValidEmail = await UserModel.findOne({ where: { email: email } });

    if (!isValidEmail) {
      res.status(404).json({
        success: false,
        message: "User with this email does not exists",
      });
      return;
    }

    const token = jwt.sign({ email }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    const resetLink = `http://localhost:9000/reset-password?token=${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset",
      text: `Here is your password reset link: ${resetLink}`,
    });

    res.status(201).json({ success: true, message: "Email is on its way" });
  } catch (error) {
    console.log(error);
    handleErrorResponse(res, error);
  }
};

export const validatePassResetToken = async (
  req: CustomRequest,
  res: Response
) => {
  const { token } = req.body;

  try {
    jwt.verify(token, process.env.SECRET_KEY);

    res.status(201).json({ success: true, message: "" });
  } catch (error) {
    res
      .status(401)
      .json({ success: false, message: "invalid or expired token" });
  }
};

export const deleteAccount = async (req: CustomRequest, res: Response) => {
  try {
    const toDelete = await UserModel.findByPk(req.user.id);

    if (!toDelete) {
      res.status(403).json({ succes: false, message: "user not found" });
      return;
    }

    const gdds = await GDDModel.findAll({ where: { user_id: req.user.id } });

    for (const gdd of gdds) {
      console.log(gdd);
      const allLocations = await LocationModel.findAll({
        where: { gdd_id: gdd.id },
      });
      const allCharacters = await CharacterModel.findAll({
        where: { gdd_id: gdd.id },
      });

      for (const location of allLocations) {
        await deleteFile(location.img); // Ждём, пока файл не удалится
      }

      for (const character of allCharacters) {
        await deleteFile(character.img); // Ждём, пока файл не удалится
      }
    }

    await GDDModel.destroy({ where: { user_id: req.user.id } });
    await toDelete.destroy();

    res.status(200).json({ success: true, message: "user was deleted" });
  } catch (error) {
    console.log(error);
    handleErrorResponse(res, error);
  }
};
