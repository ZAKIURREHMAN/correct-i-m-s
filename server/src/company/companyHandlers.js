import { prisma } from "../config/db.js";

export const createCompany = async ({ name, address, number, email }) => {
  const exists = await prisma.company.findFirst({ where: { email } });
  if (exists) {
    return { status: 409, message: "Company with this email already exists" };
  }

  const company = await prisma.company.create({
    data: { name, address, number, email },
  });

  return company;
};

export const updateCompany = async ({ companyId, name, address, number, email }) => {
  const current = await prisma.company.findUnique({ where: { companyId } });
  if (!current) {
    return { status: 404, message: "Company not found" };
  }
  const company = await prisma.company.update({ where: { companyId },data:{name, address, number, email} });
  return {company,message:"Company updated successfully"};
};

export const deleteCompany = async ({ companyId }) => {
  const current = await prisma.company.findUnique({ where: { companyId } });
  if (!current) {
    return { status: 404, message: "Company not found" };
  }

  const company = await prisma.company.delete({ where: { companyId } });
  return { status: 200, message: "Company deleted successfully",company };
};

export const getOrganizations = async () => {
  const companies = await prisma.company.findMany();
  return companies;
};

// Suppliers: create, update, delete, list (scoped to company)
export const createSupplier = async ({ companyId, name, address, number, email }) => {
   const company = await prisma.company.findUnique({ where: { companyId } });
  if (!company) {
    return { status: 404, message: "Company not found" };
  }

  const exists = await prisma.supplier.findFirst({ where: { companyId, email,name,number } });
  if (exists) {
    return { status: 409, message: "Supplier with this email already exists" };
  }

  const supplier = await prisma.supplier.create({
    data: { companyId, name, address, number, email },
  });

   return {data:supplier, status:201,message:"supplier are create successfully" };
};

export const updateSupplier = async ({ supplierId, name, address, number, email }) => {
  const current = await prisma.supplier.findUnique({ where: { supplierId } });
  if (!current) {
    return { status: 404, message: "Supplier not found" };
  }

  const supplier = await prisma.supplier.update({ where: { supplierId }, data:{name, address, number, email} });
   return {supplier, status:201,message:"supplier are updated successfully" };
};

export const deleteSupplier = async ({ supplierId }) => {
  const current = await prisma.supplier.findUnique({ where: { supplierId } });
  if (!current) {
    return { status: 404, message: "Supplier not found" };
  }

  const supplier = await prisma.supplier.delete({ where: { supplierId } });
  return supplier;
};

export const getSuppliers = async ({ companyId }) => {
  const company = await prisma.company.findUnique({ where: { companyId } });
  if (!company) {
    return { status: 404, message: "Company not found" };
  }

  const suppliers = await prisma.supplier.findMany({ where: { companyId } });
  return suppliers;
};