import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding started...");

  const modules = [
    { name: "Asset", route: "/admin/asset" },
    { name: "Asset Type", route: "/admin/asset-type" }, // ✅ NEW MODULE
    { name: "Accessory Type", route: "/admin/accessory-type" },
    { name: "Assigned Asset", route: "/admin/assigned-asset" },
    { name: "Vendor", route: "/admin/vendor" },
    { name: "Requirements", route: "/admin/requirements" },
    { name: "Procurement", route: "/admin/procurement" },
    { name: "Purchase Order", route: "/admin/purchase-order" },
    { name: "Employee", route: "/admin/employee" },
    { name: "Department", route: "/admin/department" },
    { name: "Location", route: "/admin/location" },
    { name: "User", route: "/admin/user" },
    { name: "Role", route: "/admin/role" },
    { name: "Module", route: "/admin/module" },
    { name: "Configuration", route: "/admin/configuration" },
    { name: "Dashboard", route: "/admin/dashboard" },
    { name: "Designation", route: "/admin/designation" },
    { name: "Notifications", route: "/admin/notifications" },
  ];

  const createdModules = [];

  for (const mod of modules) {
    const m = await prisma.module.upsert({
      where: { route: mod.route },
      update: {},
      create: {
        name: mod.name,
        route: mod.route,
        description: mod.name,
      },
    });

    createdModules.push(m);
  }

  console.log("Modules seeded");

  // ✅ ADMIN ROLE
  const adminRole = await prisma.role.upsert({
    where: { name: "Admin" },
    update: {},
    create: {
      name: "Admin",
      description: "Super admin with full access",
    },
  });

  console.log("Admin role created");

  // ✅ ASSIGN ALL PERMISSIONS
  for (const module of createdModules) {
    await prisma.roleModule.upsert({
      where: {
        roleId_moduleId: {
          roleId: adminRole.id,
          moduleId: module.id,
        },
      },
      update: {},
      create: {
        roleId: adminRole.id,
        moduleId: module.id,
        canView: true,
        canCreate: true,
        canEdit: true,
        canDelete: true,
      },
    });
  }

  console.log("Admin permissions assigned");

  // ✅ ADMIN USER
  const hashedPassword = await bcrypt.hash("123456", 10);

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {
      username: "admin",
      firstName: "Admin",
      lastName: "User",
      password: hashedPassword,
      roleId: adminRole.id,
    },
    create: {
      username: "admin",
      email: "admin@example.com",
      firstName: "Admin",
      lastName: "User",
      password: hashedPassword,
      roleId: adminRole.id,
    },
  });

  console.log("Admin user created:", adminUser.email);

  console.log("Seeding finished");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });