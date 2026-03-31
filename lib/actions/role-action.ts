"use server";

import { prisma } from "../db/prisma-helper";
import { roleSchema } from "../validators";
import { formatError } from "../utils";
import { Role } from "@/types";


type ActionResponse = {
  success: boolean;
  message: string;
};

function mapRole(r: any): Role {
  return {
    id: r.id,
    name: r.name,
    description: r.description,
    status: r.status,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt?.toISOString(),
  };
}

export async function getRoles(): Promise<Role[]> {
  const roles = await prisma.role.findMany({
    orderBy: { createdAt: "desc" },
  });

  return roles.map(mapRole);
}

export async function createRole(data: any): Promise<ActionResponse> {
  try {
    const role = roleSchema.parse(data);

    await prisma.role.create({
      data: {
        name: role.name,
        description: role.description,
        status: role.status,
        roleModules: {
          create: data.modules.map((m: any) => ({
            moduleId: m.moduleId,
            canView: m.canView,
            canCreate: m.canCreate,
            canEdit: m.canEdit,
            canDelete: m.canDelete,
          })),
        },
      },
    });

    return {
      success: true,
      message: "Role created successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function getRoleById(id: string) {
  try {
    const role = await prisma.role.findUnique({
      where: { id },
      include: {
        roleModules: true,
      },
    });

    if (!role) {
      return {
        success: false,
        message: "Role not found",
      };
    }

    return {
      success: true,
      data: {
        ...mapRole(role),
        roleModules: role.roleModules,
      },
      message: "Role fetched successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function updateRole(
  data: any,
  id: string,
): Promise<ActionResponse> {
  try {
    const role = roleSchema.parse(data);

    // delete old permissions
    await prisma.roleModule.deleteMany({
      where: { roleId: id },
    });

    // recreate with permissions (FIXED)
    await prisma.role.update({
      where: { id },
      data: {
        name: role.name,
        description: role.description,
        status: role.status,
        roleModules: {
          create: data.modules.map((m: any) => ({
            moduleId: m.moduleId,
            canView: m.canView,
            canCreate: m.canCreate,
            canEdit: m.canEdit,
            canDelete: m.canDelete,
          })),
        },
      },
    });

    return {
      success: true,
      message: "Role updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function deleteRole(id: string): Promise<ActionResponse> {
  try {
    await prisma.role.delete({
      where: { id },
    });

    return {
      success: true,
      message: "Role deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
