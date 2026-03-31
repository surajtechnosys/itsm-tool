"use server";

import { prisma } from "../db/prisma-helper";
import { userSchema } from "../validators";
import { formatError } from "../utils";
import bcrypt from "bcrypt";
import { z } from "zod";

type ActionResponse = {
  success: boolean;
  message: string;
};

function mapUser(u: any) {
  return {
    id: u.id,
    username: u.username ?? "",
    email: u.email ?? "",
    firstName: u.firstName ?? "",
    lastName: u.lastName ?? "",
    roleId: u.roleId ?? "",
    password: "", // ⚠️ IMPORTANT (form expects it)
    createdAt: u.createdAt?.toISOString(),
    updatedAt: u.updatedAt?.toISOString(),
  };
}

// GET USERS
export async function getUsers() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return users.map(mapUser);
}

// CREATE USER
export async function createUser(
  data: z.infer<typeof userSchema>
): Promise<ActionResponse> {
  try {
    const user = userSchema.parse(data);

    const hashedPassword = await bcrypt.hash(user.password, 10);

    await prisma.user.create({
      data: {
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        password: hashedPassword,
        roleId: user.roleId,
      },
    });

    return {
      success: true,
      message: "User created successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// GET USER BY ID
export async function getUserById(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    return {
      success: true,
      data: mapUser(user),
      message: "User fetched successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// UPDATE USER
export async function updateUser(
  data: z.infer<typeof userSchema>,
  id: string
): Promise<ActionResponse> {
  try {
    const user = userSchema.parse(data);

    const updateData: any = {
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roleId: user.roleId,
    };

    if (user.password) {
      updateData.password = await bcrypt.hash(user.password, 10);
    }

    await prisma.user.update({
      where: { id },
      data: updateData,
    });

    return {
      success: true,
      message: "User updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// DELETE USER
export async function deleteUser(id: string): Promise<ActionResponse> {
  try {
    await prisma.user.delete({
      where: { id },
    });

    return {
      success: true,
      message: "User deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
