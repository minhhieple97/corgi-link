"use server";

import { db } from "@/db";
import { users } from "@/db/schema"; // Assuming you have a schema file
import { and, asc, desc, ilike, or, sql } from "drizzle-orm";

export type UserWithoutPassword = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: Date;
  image: string | null;
};

type GetAllUsersOptions = {
  page?: number;
  limit?: number;
  sortBy?: "name" | "email" | "role" | "createdAt";
  sortOrder?: "asc" | "desc";
  search?: string;
};

export const getAllUsers = async (options: GetAllUsersOptions = {}) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
    search = "",
  } = options;

  const offset = (page - 1) * limit;

  const whereConditions = [];

  if (search) {
    whereConditions.push(
      or(ilike(users.email, `%${search}%`), ilike(users.name, `%${search}%`))
    );
  }

  const orderByColumn = users[sortBy];
  const orderDirection = sortOrder === "asc" ? asc : desc;

  const [userResults, totalResult] = await Promise.all([
    db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
        image: users.image,
      })
      .from(users)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .orderBy(orderDirection(orderByColumn))
      .limit(limit)
      .offset(offset),

    db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined),
  ]);

  const total = totalResult[0]?.count ?? 0;

  return {
    users: userResults,
    total,
  };
};
