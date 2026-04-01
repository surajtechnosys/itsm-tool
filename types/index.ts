import {
    departmentSchema,
    assetSchema,
    employeeSchema,
    locationSchema,
    moduleSchema,
    roleSchema,
    userSchema,
    deviceAssignedSchema,
    vendorSchema,
    requriementsSchema,
    configurationSchema,
    procurementSchema,
    assetTypeSchema
} from "@/lib/validators";

import z from "zod";

export type User = z.infer<typeof userSchema>
export type RoleInput = z.infer<typeof roleSchema>;
export type Role = {
  id: string;
  name: string;
  description: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt?: string | null;
};
export type Module = z.infer<typeof moduleSchema>
export type AssetType = z.infer<typeof assetTypeSchema>
export type Device = z.infer<typeof assetSchema>
export type Department = z.infer<typeof departmentSchema>
export type Location = z.infer<typeof locationSchema>
export type Employee = z.infer<typeof employeeSchema>
export type DeviceAssigned = z.infer<typeof deviceAssignedSchema>
export type Vendor = z.infer<typeof vendorSchema>
export type Requirement = z.infer<typeof requriementsSchema>
export type Configuration = z.infer<typeof configurationSchema>
export type Procurement = z.infer<typeof procurementSchema>
export type AccessoryType = {
  id?: string;
  name: string;
  description?: string;
  status: "ACTIVE" | "INACTIVE";
};







