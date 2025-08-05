import { userRoleEnum } from "@/db/schema";
import { User } from "@clerk/nextjs/server";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isUser = (user: User) => {
  return user.privateMetadata?.role?.toString() === userRoleEnum.enumValues[0];
};

export const isAdmin = (user: User) => {
  return user.privateMetadata?.role?.toString() === userRoleEnum.enumValues[1];
};

export const truncateUrl = (url: string, maxLength: number = 40) => {
  if (url.length <= maxLength) return url;
  return url.substring(0, maxLength) + "...";
};
