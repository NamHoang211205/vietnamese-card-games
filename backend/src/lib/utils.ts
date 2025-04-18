import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { Response } from "express";

config({path: ".env.local"});

export const generateToken = (userId: string, res: Response) => {
  const token = jwt.sign({userId}, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // MS
    httpOnly: true, // prevent XSS attacks cross-site scripting attacks
    sameSite: "strict", // CSRF attacks cross-site request forgery attacks
    secure: process.env.NODE_ENV !== "development",
  });

  return token;
};

export const generateRoomId = (length: number = 8): string => {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // clearer characters
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export const log = (...args: [string | number]): void => {
  const messages = args.length > 1 ? args.slice(0, args.length - 1) : args;
  let level = args.length > 1 ? args[args.length - 1] || "info" : "info";
  level = typeof level === "string" ? level.toLowerCase() : "info";
  const timestamp = new Date().toISOString();

  const formattedMessages = messages
    .map((msg) =>
      typeof msg === "object" ? `\n${JSON.stringify(msg, null, 2)}` : msg
    )
    .join(" ");

  const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${formattedMessages}`;

  switch (level) {
    case "error":
      console.error(logMessage);
      break;
    case "warn":
      console.warn(logMessage);
      break;
    default:
      console.log(logMessage);
  }
}

export const toError = (error: unknown): Error => {
  return error instanceof Error ? error : new Error(String(error));
}

