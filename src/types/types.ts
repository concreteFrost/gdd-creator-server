import { Request, Response } from "express";

// Определяем интерфейс для пользовательского запроса
export interface CustomRequest extends Request {
  user: {
    id: string;
    // Добавьте здесь дополнительные поля
    name?: string; // Пример дополнительного поля
    email?: string; // Еще одно дополнительное поле
  };
}

export interface CustomeFile extends Express.Multer.File {
  key?: string;
}
