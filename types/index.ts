import {
    departmentSchema,
    assetSchema,
    employeeSchema,
    locationSchema,
    moduleSchema,
    roleSchema,
    userSchema,
    assignedAssetSchema,
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
export type AssignedAsset = z.infer<typeof assignedAssetSchema>
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
export type FrontClient = {
  name: string;
  frontClientId: string;
  contactPerson: string;
  contactNumber: string;
  contactEmail: string;
  gstNumber: string;
  panNumber: string;
  address: string;
  country: string;
  pincode: string;
  city: string;
  state: string;
  status: string;
};
export type EndClient = {
  id: string;

  name: string;
  endClientId: string;
  frontClientId: string;

  contactPerson: string;
  contactNumber: string;
  contactEmail: string;

  status: "Active" | "Inactive";

  createdAt: Date;
  updatedAt: Date;
};






