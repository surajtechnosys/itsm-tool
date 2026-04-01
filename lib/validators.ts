import { z } from "zod";
import { AssignedDeviceStatus, Status, VendorStatus } from "@prisma/client";

export const statusEnum = z.enum(["ACTIVE", "INACTIVE"]);

// user schema

export const userSchema = z.object({
  id: z.string().optional(),

  username: z.string().min(1, "Username required"),
  email: z.string().email("Invalid email"),

  firstName: z.string().min(1, "First name required"),
  lastName: z.string().min(1, "Last name required"),

  password: z.string().min(1, "Password is required"),

  roleId: z.string().min(1, "Role is required"),

  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});


// role schema
export const roleSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Role name is required"),
  description: z.string().min(1, "Role description is required"),
  status: z.enum(Object.values(Status)),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
});

export const moduleSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  route: z.string().optional(),
  status: z.enum(Object.values(Status)),
  createdAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional(),
});

// assetType schema
export const assetTypeSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Asset Type name is required"),
  description: z.string().min(1, "Asset Type description is required"),
  status: z.enum(Object.values(Status)),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
});

//accessory type schema
export const accessoryTypeSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Accessory Type name is required"),
  description: z.string().optional(),
  status: z.nativeEnum(Status),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// asset schema
export const assetSchema = z.object({
  id: z.string().optional(),

  // Core
  name: z.string().min(1, "Asset name is required"),
  assetTypeId: z.string().min(1, "Asset Type is required"),
  serialNumber: z.string().optional(),

  // Details
  brand: z.string().optional(),
  model: z.string().optional(),
  configuration: z.string().optional(),

  // Purchase
  purchaseDate: z.coerce.date().optional().nullable(),
  purchaseValue: z.coerce.number().optional(),
  invoiceNumber: z.string().optional(),
  vendor: z.string().optional(),

  // Status & condition
  status: z.enum(Object.values(Status)).optional(),
  condition: z.string().optional(),
  hasWarranty: z.boolean().default(false),

  // Extra
  remarks: z.string().optional(),

  // Accessories (IMPORTANT)
  accessories: z.array(
    z.object({
      type: z.string().min(1, "Accessory type required"),
      make: z.string().optional(),
      model: z.string().optional(),
      serialNo: z.string().optional(),
      condition: z.string().min(1),
    })
  ).optional(),

  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// department schema

export const departmentSchema = z.object({
  id: z.string().optional(),

  name: z.string().min(1, "Department name is required"),
  code: z.string().min(1, "Department code is required"), // ✅ ADD

  description: z.string().min(1, "Department description is required"),

  status: z.enum(Object.values(Status)),

  createdAt: z.date().optional().nullable(),
  updatedAt: z.date().optional().nullable(),
});

// employee schema
export const employeeSchema = z.object({
  id: z.string().optional(),
  first_name: z.string().min(1, "Employee first_name is required"),
  last_name: z.string().min(1, "Employee last_name is required"),
  email: z.string().min(1, "Employee email is required"),
  phoneNumber: z.string().min(1, "Employee phone number is required"),
  dateOfBirth: z.date().nullable().optional(),
  hireDate: z.date().nullable().optional(),
  status: z.enum(Object.values(Status)),
  departmentId: z.string().min(1, "Department is required"),
  designationId: z.string().nullable().optional(), 
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
});


//designation schema

export const designationSchema = z.object({
  id: z.string().optional(),

  name: z.string().min(1, "Designation title is required"),
  code: z.string().min(1, "Designation code is required"),

  level: z.coerce.number().min(1, "Level is required"),

  description: z.string().min(1, "Description is required"),

  status: z.enum(Object.values(Status)),

  createdAt: z.date().optional().nullable(),
  updatedAt: z.date().optional().nullable(),
});

// location schema

export const locationSchema = z.object({
  id: z.string().optional(),

  name: z.string().min(1, "Location name is required"),
  code: z.string().min(1, "Location code is required"),

  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  pincode: z.string().min(1, "Pincode is required"),

  hasMultipleFloors: z.boolean().default(false),

  status: z.enum(Object.values(Status)),

  createdAt: z.date().optional().nullable(),
  updatedAt: z.date().optional().nullable(),
});

// device assigned schema
export const deviceAssignedSchema = z.object({
  id: z.string().optional(),
  deviceId: z.string(),
  employeeId: z.string(),
  remarks: z.string(),
  status: z.enum(Object.values(AssignedDeviceStatus)),
  assignedDate: z.union([z.date(), z.string()]),
  returnedDate: z.union([z.date(), z.string()]).nullable().optional(),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
});

// vendor table schema
export const vendorSchema = z.object({
  id: z.string().optional(),
  vendorCode: z.string().min(1, "vendor code is required"),
  name: z.string().min(1, "vendor name is required"),
  contactPerson: z.string().min(1, "contact person is required"),
  phone: z.string().min(1, "phone is required"),
  email: z.string().min(1, "email is required"),
  addressLine1: z.string().min(1, "address line 1 is required"),
  addressLine2: z.string().min(1, "address line 2 is required"),
  city: z.string().min(1, "city is required"),
  state: z.string().min(1, "state is required"),
  postalCode: z.string().min(1, "postal code is required"),
  country: z.string().min(1, "country is required"),
  taxId: z.string().min(1, "taxID is required"),
  website: z.string().min(1, "website is required"),
  status: z.enum(Object.values(VendorStatus)),
  notes: z.string().min(1, "note is required"),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
});

// requriements
export const requriementsSchema = z.object({
  id: z.string().optional(),
  manufatured: z.string().min(1),
  model: z.string().min(1),

  vendorIds: z.array(z.string()),

  configuration: z.array(
    z.object({
      item: z.string().min(1, "Item required"),
      quantity: z.string().optional(),
      description: z.string().optional(),
    })
  ),

  warranty: z.string(),
  warrantyType: z.string().optional(),

  quotationValidity: z.union([z.string(), z.date()]),

  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),

  notes: z.string().optional(),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
});

// procurement schema
export const procurementSchema = z.object({
  id: z.string().optional(),
  manufatured: z.string().min(1),
  model: z.string().min(1),
  vendorId: z.string(),
  requirementId: z.string(),
  configuration: z.array(
    z.object({
      item: z.string().min(1, "Item required"),
      quantity: z.string().optional(),
      description: z.string().optional(),
    })
  ),

  warranty: z.string(),
  warrantyType: z.string().optional(),
  quotationValidity: z.union([z.string(), z.date()]),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  notes: z.string().optional(),
   createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
});

// configuration
export const configurationSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  logo: z.union([z.instanceof(File), z.string()]).optional(),
  favicon: z.union([z.instanceof(File), z.string()]).optional(),
  smtpHost: z.string().min(1),
  smtpPort: z.coerce.number(),

  smtpUser: z.string().min(1),
  smtpPassword: z.string().min(1),

  fromEmail: z.string().email()
})

export const purchaseOrderItemSchema = z.object({
  deviceCategoryId: z.string().uuid(),
  quantity: z.number().int().positive(),
  unitPrice: z.number().nonnegative()
});

export const createPurchaseOrderSchema = z.object({
  requirementId: z.string().uuid(),
  vendorId: z.string().uuid(),
  items: z
    .array(purchaseOrderItemSchema)
    .min(1, "At least one item is required")
});

export const vendorRequestSchema = z.object({
  manufatured: z.string().min(2, "Manufacturer is required"),
  model: z.string().min(1, "Model is required"),
  configuration: z.string().optional(),
  warranty: z.string().min(1, "Warranty is required"),
  warrantyType: z.string().optional(),
  quotationValidity: z.coerce.date(),
  price: z.coerce.number().positive("Price must be greater than 0"),
  remarks: z.string().optional(),
});

export type VendorRequestInput = z.infer<typeof vendorRequestSchema>;

