"use server";

import { Location } from "@/types";
import { prisma } from "../db/prisma-helper";
import { locationSchema } from "../validators";
import { formatError } from "../utils";

/* ---------------- GET ALL ---------------- */

export async function getLocation() {
  return prisma.location.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

/* ---------------- CREATE ---------------- */

export async function createLocation(data: Location) {
  try {
    const location = locationSchema.parse(data);

    await prisma.location.create({
      data: {
        name: location.name,
        code: location.code,
        address: location.address,
        city: location.city,
        state: location.state,
        country: location.country,
        pincode: location.pincode,
        hasMultipleFloors: location.hasMultipleFloors,
        status: location.status,
      },
    });

    return {
      success: true,
      message: "Location created successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

/* ---------------- GET BY ID ---------------- */

export async function getLocationById(id: string) {
  try {
    const location = await prisma.location.findUnique({
      where: { id },
    });

    if (!location) {
      return {
        success: false,
        message: "Location not found",
      };
    }

    return {
      success: true,
      data: location,
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

/* ---------------- UPDATE ---------------- */

export async function updateLocation(data: Location, id: string) {
  try {
    const location = locationSchema.parse(data);

    await prisma.location.update({
      where: { id },
      data: {
        name: location.name,
        code: location.code,
        address: location.address,
        city: location.city,
        state: location.state,
        country: location.country,
        pincode: location.pincode,
        hasMultipleFloors: location.hasMultipleFloors,
        status: location.status,
      },
    });

    return {
      success: true,
      message: "Location updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

/* ---------------- DELETE ---------------- */

export async function deleteLocation(id: string) {
  try {
    await prisma.location.delete({
      where: { id },
    });

    return {
      success: true,
      message: "Location deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}