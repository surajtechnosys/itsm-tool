import { AssignmentStatus ,Status } from "@prisma/client";

export const APP_NAME =
  process.env.NEXT_APP_APP_NAME ?? "Asset Management System";
export const APP_DESCRIPTION =
  process.env.NEXT_APP_DESCRIPTION ?? "Asset Management System";
export const SERVER_URL =
  process.env.NEXT_APP_SERVER_URL ?? "http://localhost:3000";

export const roleDefaultValues = {
  name: "",
  description: "",
  status: Status.INACTIVE,
};

export const userDefaultValues = {
  username: "",
  email: "",
  firstName: "",
  lastName: "",
  password: "",
  roleId: "",
};

export const moduleDefaultValues = {
  name: "",
  description: "",
  role: "",
  status: Status.ACTIVE,
};

export const assetTypeDefaultValues = {
  name: "",
  description: "",
  status: Status.ACTIVE,
};

export const departmentDefaultValues = {
  name: "",
  description: "",
  status: Status.ACTIVE,
};

export const accessoryTypeDefaultValues = {
  name: "",
  description: "",
  status: Status.ACTIVE,
};

export const assetDefaultValues = {
  name: "",
  assetTypeId: "",
  serialNumber: "",

  brand: "",
  model: "",
  configuration: "",

  purchaseDate: null,
  purchaseValue: undefined,

  invoiceNumber: "",
  vendor: "",

  status: "ACTIVE" as Status,
  condition: "Good",

  hasWarranty: false,
  warrantyStartDate: null,
  warrantyEndDate: null,
  warrantyDuration: "",
  warrantyProvider: "",
  warrantyType: "",

  remarks: "",

  accessories: [],
};

export const employeeDefaultValues = {
  first_name: "",
  last_name: "",
  email: "",
  phoneNumber: "",
  dateOfBirth: null,
  hireDate: null,
  salary: "",
  departmentId: "",
  locationId: "",
  status: Status.ACTIVE,
};

export const locationDefaultValues = {
  name: "",
  code: "",
  address: "",
  city: "",
  state: "",
  country: "India",
  pincode: "",
  hasMultipleFloors: false,
  status: "ACTIVE",
};


export const assignedAssetDefaultValues = {
  assetId: "",
  employeeId: "",
  remarks: "",
  status: "ASSIGNED", // default when creating
  assignedDate: new Date(),
  returnedDate: null, // ✅ important fix
};

const purchaseOrderDefaultValues = {
  endClientId: "",
  poNumber: "",

  contactName: "",
  contactNumber: "",
  contactEmail: "",

  startDate: "",
  endDate: "",
  poReceiveDate: "",

  employeeId: "",
  poType: "",

  status: "Active",   // ✅ important default
  poValue: "",
};
