import { prisma } from "../config/db.js";

export const productHandler = async ({
  name,
  warranty,
  buyPrice,
  sellingPrice,
  quantity,
  alert,
  supplierId,
}) => {
  const createProduct = await prisma.products.create({
    data: { name, warranty, buyPrice, sellingPrice, quantity, alert, supplierId },
  });
  return { status: 201, message: "product are create successfully", data: createProduct };
};

export const updateProduct = async ({
  name,
  warranty,
  buyPrice,
  sellingPrice,
  quantity,
  alert,
  productId,
}) => {
  const findProduct = await prisma.products.findUnique({
    where: { productId: productId },
  });

  if (!findProduct) {
    return { status: 404, message: "product not found" };
  }
  const updateProduct = await prisma.products.update({
    where: { productId: productId },
    data: { name, warranty, buyPrice, sellingPrice, quantity, alert },
  });
  return {
    status: 200,
    message: "product are update successfully",
    updateProduct,
  };
};

export const deleteProduct = async ({ productId }) => {
  const findProduct = await prisma.products.findUnique({
    where: { productId: productId },
  });
  if (!findProduct) {
    return { status: 404, message: "product not found" };
  }
  const deleteProduct = await prisma.products.delete({
    where: { productId: productId },
  });
  return {
    status: 200,
    message: "product are delete successfully",
    deleteProduct,
  };
};

export const getAllProduct = async () => {
  const getAllProduct = await prisma.products.findMany();
  return {
    status: 200,
    message: "all product are get successfully",
    getAllProduct,
  };
};

export const getProductsByCompanyId = async ({ companyId }) => {
  // Validate company exists
  const company = await prisma.company.findUnique({ where: { companyId } });
  if (!company) {
    return { status: 404, message: "Company not found" };
  }

  // Find suppliers under this company
  const suppliers = await prisma.supplier.findMany({
    where: { companyId },
    select: { supplierId: true },
  });
  const supplierIds = suppliers.map((s) => s.supplierId);

  if (supplierIds.length === 0) {
    return { status: 200, message: "No suppliers for company", data: [] };
  }

  // Find products that belong to suppliers of this company and include supplier details
  const products = await prisma.products.findMany({
    where: { supplierId: { in: supplierIds } },
    include: { supplier: true },
  });

  return { status: 200, message: "products fetched successfully", data: products };
};